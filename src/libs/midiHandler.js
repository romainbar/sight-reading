
/** MIDI handler class
 * @param {function} midiNoteCallback - A note callback that takes 3 parameters: function (note, velocity, channel)
 * @class 
 */
function midiHandler (midiNoteCallback)
{
    function onMIDIMessage (event)
    {
        var data = event.data;
        var cmd = data[0] >> 4;
        var channel = data[0] & 0xF;
        var note = data[1];
        var velocity = data[2];

        midiNoteCallback (note, velocity, channel);
    };


    function midiSuccess (midi)
    {
        var inputs = midi.inputs.values ();

        // loop through inputs
        for (var i = inputs.next (); i && !i.done; i = inputs.next ()) {
            // listen MIDI message (bind our function)
            i.value.onmidimessage = onMIDIMessage;
        }
    };


    function midiFailure (error)
    {
        console.log ('MIDI error:', error);
    };


    function init ()
    {
        // initialize MIDI API
        if (navigator.requestMIDIAccess) {
            // bind MIDI functions
            navigator.requestMIDIAccess ({ sysex: false })
            .then (midiSuccess, midiFailure);
        } else {
            alert ("Your browser doesn't support the MIDI access interface.");
        }
    };

    init ();
}



