<h1>Input</h1>
<p>The input is a width <em>w</em> and height <em>h</em> for the golf course followed by <em>h</em> lines specifying the contents of the golf course. '.' means a patch of grass; 'X' means a patch of water; 'H' means a hole; a number represents a ball with a <strong>shot count</strong>.
</p>
<p>
The <strong>shot count</strong> is simultaneously the number of times the ball can be hit, and the number of squares it moves when hit. Each time it is hit, its shot count goes down by one.
</p>
<p>
<h1>Rules</h1>
<ul>
<li>All balls land in a hole.</li>
<li>Balls do not cross each other's paths.</li>
<li>Balls do not cross over other ball or hole locations.</li>
<li>Balls do not get knocked into water, but can be hit over it.</li>
<li>Balls do not go out of bounds.</li>
</ul>
</p>
<h1>Output</h1>
<p>
A grid of the same size as the inputted golf course with arrows representing the movement of the balls to get to a solution state.
</p>
<h1>Example</h1>
<p>
<strong>Input</strong> (Width 3, height 3, followed by 3 lines of size 3 each specifying the contents of the course)<br />
<pre>
3 3
2.X
X.H
.H1
</pre><br />
<strong>Output</strong><br />
<pre>
v..
v..
>.^
</pre>
</p>


