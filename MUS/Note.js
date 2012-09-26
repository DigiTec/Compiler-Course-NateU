var endTime = function (time, expr) {
    if ( expr.tag === "note" )
    {
        return time + expr.dur;
    }
    else if ( expr.tag === "par" )
    {
        return time + Math.max(endTime(0, expr.left), endTime(0, expr.right));
    }
    else
    {
        return time + endTime(0, expr.left) + endTime(0, expr.right);
    }
};

// maybe some helper functions

var compilePart = function(expr, startTime) {
    var state = { notes: [], endTime: 0 };
    var leftState;
    var rightState;
    
    if ( expr.tag === "note" )
    {
        state.notes.push({ tag: "note", pitch: expr.pitch, start: startTime, dur: expr.dur });
        state.endTime = startTime + expr.dur;
    }
    else if ( expr.tag == "seq" )
    {
        leftState = compilePart(expr.left, startTime);
        rightState = compilePart(expr.right, leftState.endTime);
        
        state.notes = leftState.notes.concat(rightState.notes);
        state.endTime = rightState.endTime;
    }
    else if ( expr.tag == "par" )
    {
        leftState = compilePart(expr.left, startTime);
        rightState = compilePart(expr.right, startTime);
        
        state.notes = leftState.notes.concat(rightState.notes);
        state.endTime = Math.max(leftState.endTime, rightState.endTime);
    }
    
    return state;
};

var compile = function (musexpr) {
    var state = compilePart(musexpr, 0);
    return state.notes;
};