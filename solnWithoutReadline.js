// Functional JavaScript Backtracking by Jake E. Hoffmann  
(function () {
  "use strict";
  
//  let inputs = readline().split(' ');
//  let width = parseInt(inputs[0]);
//  let height = parseInt(inputs[1]);
//  let golfCourse = []; 
//  let balls = [];

  let width = 40;
  let height = 8;
  let golfCourse = [];
  let balls = [];
  let input = [];

  input[0] =  '.XXX.5XX4H5............4H..3XXH.2.HX3...';
  input[1] =  'XX4.X..X......3.....HH.2X.....5.....4XX.';
  input[2] =  'X4..X3.X......H...5.....XXXXXXX2.HX2..H.';
  input[3] =  'X..XXXXX.....H3.H.X..22X3XXH.X2X...2HHXH';
  input[4] =  '.X.X.H.X........X3XH.HXX.XXXXX.H..HX..2.';
  input[5] =  'X.HX.X.X....HH....X3.H.X.....H..XXXX3...';
  input[6] =  'X..X.H.X.43......XXH....HXX3..H.X2.HX2..';
  input[7] =  '.XHXXXXX..H3H...H2X.H..3X2..HXX3H.2XXXXH';

  // returned object represents one cell in the golf course grid.
  // type: water (X), hole (H), or grass (.) 
  // walked: null,<,^,v,>,occ 
  // null means no activity, arrows are as in description, occ means an occupied space  
  let cellObject = (value) => ({ 
    type: !isNaN(value) ? parseInt(value) : value, 
    walked: !isNaN(value) ? 'occ' : null
  });

  // updates the balls array to move a ball to it's new location
  let moveBall = (balls, action, golfCourse) => {
    return balls.map((e) => {
      if (e.x === action.ball_x && e.y === action.ball_y) {
	let x = e.x;
	let y = e.y
	switch(action.direction) {
        case '<':
          e.x -= golfCourse[y][x].type;
          break;
        case '^':
          e.y -= golfCourse[y][x].type;
          break;
        case '>':
          e.x += golfCourse[y][x].type;
          break;
        case 'v':
          e.y += golfCourse[y][x].type;
          break;
	}
      }
      return {x: e.x, y: e.y};
    });
  };

  // updates the balls array to remove a ball when it goes into a hole
  let scoreBall = (balls, action) => balls.filter((e) => e.x !== action.ball_x || e.y !== action.ball_y);

  // adds a ball (undoing a score)
  let addBall = (balls, action) => balls.concat({x: action.ball_x, y: action.ball_y});

  // copies the golfCourse so that we don't mutate it   
  let copyCourse = (golfCourse) => {
    let copy = [];
    golfCourse.forEach((row, index) => {
      copy[index] = row.map((el) => Object.assign({}, el));
    });
    return copy;
  };

  // copies the balls so we don't mutate them
  let copyBalls = (balls) => balls.map((el) => Object.assign({}, el));
  
  // expects data.golfCourse to be an array of arrays of objects representing the golf course grid
  // expects data.balls to be an array of ball objects [{x1,y1},{x2,y2}...]
  // expects action to be an object containing coordinates of a ball and a direction (<^>v) to aim it
  // returns empty object if it's not a valid action, otherwise returns the result of applying the action to the golf course
  let isValid = (data, action) => {
    let courseCopy = copyCourse(data.golfCourse);
    let ballsCopy = copyBalls(data.balls);
    let ball_x = action.ball_x;
    let ball_y = action.ball_y;
    let shotCount = courseCopy[ball_y][ball_x].type;
    let crossedPaths = false;
    
    //  console.log(JSON.stringify(action));
    
    // this switch could obviously be refactored to not repeat the same pattern for each direction,
    //   but I feel it would lose clarity.
    switch (action.direction) {
    case '<':
      if (ball_x - shotCount < 0) { // does it go out of bounds?
        break;
      }
      // does it land on water or on treaded ground?  
      if (courseCopy[ball_y][ball_x - shotCount].type === 'X' || courseCopy[ball_y][ball_x - shotCount].walked !== null) { 
        break; 
      }
      // does the final shot (shotCount=1) not land in a hole? 
      if (shotCount === 1 && courseCopy[ball_y][ball_x - 1].type !== 'H') {
        break;
      }
      courseCopy[ball_y][ball_x].walked = '<'; 
      for (let i = ball_x - 1; i > ball_x - shotCount; i -= 1) {
        // does it cross over other balls paths or holes?  
        if (courseCopy[ball_y][i].walked !== null || courseCopy[ball_y][i].type === 'H') {   
          crossedPaths = true;
          break; 
        }
        courseCopy[ball_y][i].walked = '<';
      }
      if (crossedPaths) {
        break;
      }
      courseCopy[ball_y][ball_x - shotCount].type = courseCopy[ball_y][ball_x - shotCount].type === 'H' ? 'H' : shotCount - 1;
      courseCopy[ball_y][ball_x - shotCount].walked = 'occ';
      ballsCopy = courseCopy[ball_y][ball_x - shotCount].type === 'H' ? scoreBall(ballsCopy, action) : moveBall(ballsCopy, action, courseCopy); 
      return {golfCourse: courseCopy, balls: ballsCopy};    
    case '^':
      if (ball_y - shotCount < 0) { // does it go out of bounds?
        break; 
      }
      // does it land on water or on treaded ground?  
      if (courseCopy[ball_y - shotCount][ball_x].type === 'X' || courseCopy[ball_y - shotCount][ball_x].walked !== null) { 
        break; 
      }
      // does the final shot (shotCount=1) not land in a hole? 
      if (shotCount === 1 && courseCopy[ball_y - 1][ball_x].type !== 'H') {
        break;
      }
      courseCopy[ball_y][ball_x].walked = '^'; 
      for (let i = ball_y - 1; i > ball_y - shotCount; i -= 1) {
        // does it cross over other balls paths or holes?
        if (courseCopy[i][ball_x].walked !== null || courseCopy[i][ball_x].type === 'H') {  
          crossedPaths = true;
          break;          
        }
        courseCopy[i][ball_x].walked = '^';
      }
      if (crossedPaths) {
        break;
      }
      courseCopy[ball_y - shotCount][ball_x].type = courseCopy[ball_y - shotCount][ball_x].type === 'H' ? 'H' : shotCount - 1;
      courseCopy[ball_y - shotCount][ball_x].walked = 'occ';
      ballsCopy = courseCopy[ball_y - shotCount][ball_x].type === 'H' ? scoreBall(ballsCopy, action) : moveBall(ballsCopy, action, courseCopy); 
      return {golfCourse: courseCopy, balls: ballsCopy}; 

    case '>':
      if (ball_x + shotCount > width-1) { // does it go out of bounds?
        break; 
      }
      // does it land on water or on treaded ground?
      if (courseCopy[ball_y][ball_x + shotCount].type === 'X' || courseCopy[ball_y][ball_x + shotCount].walked !== null) {
        break;    
      }
      // does the final shot (shotCount=1) not land in a hole? 
      if (shotCount === 1 && courseCopy[ball_y][ball_x + 1].type !== 'H') {
        break;
      }      
      courseCopy[ball_y][ball_x].walked = '>';
      for (let i = ball_x + 1; i < ball_x + shotCount; i += 1) {
        // does it cross over other balls paths or holes? 
        if (courseCopy[ball_y][i].walked !== null || courseCopy[ball_y][i].type === 'H') { 
          
          //console.log(ball_y,i,JSON.stringify(courseCopy[ball_y][i]));    
          crossedPaths = true;
          break;
        }
        courseCopy[ball_y][i].walked = '>';
      }
      if (crossedPaths) {
        break;
      }
      courseCopy[ball_y][ball_x + shotCount].type = courseCopy[ball_y][ball_x + shotCount].type === 'H' ? 'H' : shotCount - 1;
      courseCopy[ball_y][ball_x + shotCount].walked = 'occ';
      ballsCopy = courseCopy[ball_y][ball_x + shotCount].type === 'H' ? scoreBall(ballsCopy, action) : moveBall(ballsCopy, action, courseCopy); 
      return {golfCourse: courseCopy, balls: ballsCopy}; 

    case 'v':
      if (ball_y + shotCount > height-1) { // does it go out of bounds?
        break; 
      }
      // does it land on water or on treaded ground?
      if (courseCopy[ball_y + shotCount][ball_x].type === 'X' || courseCopy[ball_y + shotCount][ball_x].walked !== null) {
        break;    
      }
      // does the final shot (shotCount=1) not land in a hole? 
      if (shotCount === 1 && courseCopy[ball_y + 1][ball_x].type !== 'H') {
        break;
      }   
      courseCopy[ball_y][ball_x].walked = 'v';
      for (let i = ball_y + 1; i < ball_y + shotCount; i += 1) {
        // does it cross over other balls paths or holes?   
        if (courseCopy[i][ball_x].walked !== null || courseCopy[i][ball_x].type === 'H') {
          crossedPaths = true;
          break;
        }
        courseCopy[i][ball_x].walked = 'v';
      }
      if (crossedPaths) {
        break;
      }
      courseCopy[ball_y + shotCount][ball_x].type = courseCopy[ball_y + shotCount][ball_x].type === 'H' ? 'H' : shotCount - 1;
      courseCopy[ball_y + shotCount][ball_x].walked = 'occ';
      ballsCopy = courseCopy[ball_y + shotCount][ball_x].type === 'H' ? scoreBall(ballsCopy, action) : moveBall(ballsCopy, action, courseCopy); 
      return {golfCourse: courseCopy, balls: ballsCopy};  
    }
    //console.log('notValid\n---'); 
    return {}; // action doesn't match or broke from valid action sequence
  };

  let getBalls = (i, golfCourse) => golfCourse.forEach((element, index) => {
    if (!isNaN(element.type)) {
      balls.push({x: index, y: i});
    }
  }); 

  // prints the direction balls traveled if any, else prints a dot
  let displaySolution = (golfCourse) => {
    golfCourse.forEach((arr) => console.log(arr.map((e) => e.walked === 'occ' ? '.' : e.walked || '.').join('')));
  };

  // displays the balls neatly, for debugging 
  let displayBalls = (balls) => {
    balls.forEach((e) => console.log(e.x,e.y));
  };

  // This is where the backtracking algorithm is defined
  let findSolution = (golfCourse, balls) => {
    if (balls.length === 0) {
      displaySolution(golfCourse);
      throw 'done';
    }
    ['v','>','^','<'].forEach((element) => {
      let action = {direction: element, ball_x: balls[0].x, ball_y: balls[0].y};
      let newData = isValid({golfCourse, balls}, action);
      if (Object.keys(newData).length !== 0) {
    	findSolution(newData.golfCourse, newData.balls, action);
      }
    });
  };

  let displayCourse = (golfCourse) => {
    for (let i = 0; i < height; i++) { 
      console.log(JSON.stringify(golfCourse[i]));
    }
  };

  // get the input, uses some function variables defined above 
  for (let i = 0; i < height; i++) {
    let row = input[i];
    let map = Array.prototype.map;
    golfCourse[i] = map.call(row, cellObject);
    getBalls(i, golfCourse[i]);
    // print the golf course as we receive the input, for debug purposes
    //   console.log(JSON.stringify(golfCourse[i]));
  }

  // throwing seems to be a clean way to exit immediately after 1 solution is found
  try {
    findSolution(golfCourse, balls, {});
  } catch (e) {
  }
  
  // Some tests below here 

  // console.log('-------\nballs: ');
  // console.log(JSON.stringify(balls));
  // let testAction = {ball_x: 1, ball_y: 3, direction: '^'}
  // golfCourse = isValid({golfCourse, balls}, testAction).golfCourse;
  // golfCourse ? displayCourse(golfCourse) : console.log(golfCourse);
  // golfCourse = downdate(golfCourse, testAction);
  // console.log('---');
  // golfCourse ? displayCourse(golfCourse) : console.log(golfCourse);

}());
