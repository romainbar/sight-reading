
/** MIDI display class
 * @param {string} displayCanvasId - ID of an HTML5 canvas where the notes are displayed
 * @class 
 */
function midiDisplay (displayCanvasId, width, scale)
{
    // convert a MIDI note to a VexTab one
    var midi2VexTab = {
            21: 'A/0', 22: 'A#/0', 23: 'B/0',
            24: 'C/1', 25: 'C#/1', 26: 'D/1', 27: 'D#/1', 28: 'E/1',
            29: 'F/1', 30: 'F#/1', 31: 'G/1', 32: 'G#/1', 33: 'A/1', 34: 'A#/1', 35: 'B/1',
            36: 'C/2', 37: 'C#/2', 38: 'D/2', 39: 'D#/2', 40: 'E/2',
            41: 'F/2', 42: 'F#/2', 43: 'G/2', 44: 'G#/2', 45: 'A/2', 46: 'A#/2', 47: 'B/2',
            48: 'C/3', 49: 'C#/3', 50: 'D/3', 51: 'D#/3', 52: 'E/3',
            53: 'F/3', 54: 'F#/3', 55: 'G/3', 56: 'G#/3', 57: 'A/3', 58: 'A#/3', 59: 'B/3',
            60: 'C/4', 61: 'C#/4', 62: 'D/4', 63: 'D#/4', 64: 'E/4',
            65: 'F/4', 66: 'F#/4', 67: 'G/4', 68: 'G#/4', 69: 'A/4', 70: 'A#/4', 71: 'B/4',
            72: 'C/5', 73: 'C#/5', 74: 'D/5', 75: 'D#/5', 76: 'E/5',
            77: 'F/5', 78: 'F#/5', 79: 'G/5', 80: 'G#/5', 81: 'A/5', 82: 'A#/5', 83: 'B/5',
            84: 'C/6', 85: 'C#/6', 86: 'D/6', 87: 'D#/6', 88: 'E/6',
            89: 'F/6', 90: 'F#/6', 91: 'G/6', 92: 'G#/6', 93: 'A/6', 94: 'A#/6', 95: 'B/6',
            96: 'C/7', 97: 'C#/7', 98: 'D/7', 99: 'D#/7', 100: 'E/7',
            101: 'F/7', 102: 'F#/7', 103: 'G/7', 104: 'G#/7', 105: 'A/7', 106: 'A#/7', 107: 'B/7',
            108: 'C/8'
    };


    function pianoVexTab (trebleNotes, bassNotes)
    {
        var text = '';
        text += 'options space=55\n'; // put enough space for the highest note
        text += 'tabstave notation=true tablature=false\n'; // treble key
        text += 'notes ' + trebleNotes + '\n';
        text += 'tabstave notation=true tablature=false clef=bass\n'; // bass key
        text += 'notes ' + bassNotes + '\n';
        text += 'options space=50\n'; // put enough space for the lowest note

        return text;
    };


    function renderVexTab (code)
    {
        // create renderer from canvas element #'displayCanvasId'
        var canvas = $('#'+displayCanvasId)[0];
        var renderer = new Vex.Flow.Renderer (canvas, Vex.Flow.Renderer.Backends.CANVAS);
        var artist = new Artist (10, 10, width, { scale: scale });
        var vextab = new VexTab (artist);

        try {
            vextab.parse (code);
            artist.render (renderer);
        } catch (error) {
            console.log (error);
        }
    };


    this.displayPianoNote = function (note)
    {
        // default: rest
        var trebleNotes = '##';
        var bassNotes = '##';

        if (note >= 60) {
            // treble staff (60: A/4, 108: C/8)
            trebleNotes = midi2VexTab[note];
        } else {
            // bass staff (21: A/0, 59: G/3)
            bassNotes = midi2VexTab[note];
        }

        renderVexTab (pianoVexTab (trebleNotes, bassNotes));
    };
}


