
var midiApp = angular.module ('midiModule', []);

var mainController = ['$scope', function ($scope)
{
    var midiControl;
    var midiShowTreble;
    var midiShowBass;
    var displayedNote;


    function getRandomMidiNote ()
    {
        var min = 21, max = 108;

        if (!$scope.bassActive) {
            // exclude bass
            min = 60;
        }
        if (!$scope.trebleActive) {
            // exclude treble
            max = 59;
        }

        var randomIntInclusive = Math.floor (Math.random() * (max -min + 1)) + min;

        return randomIntInclusive;
    };


    function displayNewNote ()
    {
        displayedNote = getRandomMidiNote ();
        if (displayedNote >= 60) {
            midiShowTreble.displayStaffNotes ([displayedNote], 'treble');
            midiShowBass.displayStaffNotes (false, 'bass');
        } else {
            midiShowTreble.displayStaffNotes (false, 'treble');
            midiShowBass.displayStaffNotes ([displayedNote], 'bass');
        }
    };


    function onMIDINote (note, velocity, channel)
    {
        if (velocity > 0) {
            if (note === displayedNote) {
                $scope.result = 'Success!';
                $scope.resultClass = 'success';
                displayNewNote ();
            } else {
                $scope.result = 'ERROR :-(';
                $scope.resultClass = 'error';
            }

            // force Angular refresh
            $scope.$apply();
        }
    };


    $scope.configurationChange = function ()
    {
        // resfresh note
        displayNewNote ();
    }


    function init ()
    {
        // canvas ID = 'noteShow', width = 400, scale = 1.5
        midiShowTreble = new midiDisplay ('trebleCanvas', 400, 1.5);
        midiShowBass = new midiDisplay ('bassCanvas', 400, 1.5);

        // display first random note
        displayNewNote ();

        // initialize MIDI
        midiControl = new midiHandler (onMIDINote);
    };

    init ();
}];

midiApp.controller ('mainController', mainController);



