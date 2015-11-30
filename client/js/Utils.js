
function RemoveBlankLines( input ) {
	//return input.replace( /^\r\n/, 'abc' ).replace( /^\n/, 'abc' );
	return input.replace( /(\r\n|\n|\r)/gm, '' );
}

function RemoveHTMLTags( htmlString ) {
	if( htmlString ) {
		var mydiv = document.createElement( 'div' );
		mydiv.innerHTML = htmlString;

		if( document.all ) {	// IE stuff
			return mydiv.innerText;
		} else { // Mozilla does not work with innerText
			return mydiv.textContent;
		}
	}
}

function StripFloat( number ) {
    return ( parseFloat( number.toPrecision( 12 ) ) );
}

function RoundDecimals( value ) {
	return Math.round( value * localStorage.Decimals ) / localStorage.Decimals;
}

function CalcLineAngle( firstPoint, secondPoint ) {
	/*var width = Math.abs( secondPoint.x - firstPoint.x );
	var height = Math.abs( secondPoint.y - firstPoint.y );*/
	var width = secondPoint.x - firstPoint.x ;
	var height = secondPoint.y - firstPoint.y;
	var radians = Math.atan( width / height );
	return radians * 180 / Math.PI;
}

function CalcLineMiddlePoint( start, end ) {
	var middlePoint = new Point();

	if( start.x > end.x ) {
		middlePoint.x = Math.round( ( start.x - end.x ) / 2 ) + end.x;
	} else {
		middlePoint.x = Math.round( ( end.x - start.x ) / 2 ) + start.x;
	}

	if( start.y > end.y ) {
		middlePoint.y = Math.round( ( start.y - end.y ) / 2 ) + end.y;
	} else {
		middlePoint.y = Math.round( ( end.y - start.y ) / 2 ) + start.y;
	}

	return middlePoint;
}

function CalcRotationOffset( angle, distance ) {
	var offsetX = distance - Math.abs(  angle * distance / 90 );
	if( angle > 0 ) {
		offsetX = Math.abs( angle * distance / 90 ) - distance;
	}
	var offsetY = Math.abs( angle * distance / 90 );

	return { x: offsetX, y: offsetY };
}

function GetCursorPosition( e ) {
	var x;
	var y;

	if( e.pageX != undefined && e.pageY != undefined ) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	x -= window.canvas.offsetLeft;
	y -= window.canvas.offsetTop;

	//var cell = new Cell( Math.floor( y/kPieceHeight ), Math.floor( x/kPieceWidth ) );
	var point = new Point( x, y );

	return point;
}

function Quote( string ) {
	return string.replace( /'/g, '\\\'' );
}
