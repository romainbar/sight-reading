
var midiApp = angular.module ('midiModule', []);

var mainController = ['$scope', function ($scope)
{
    var midiControl;
    var midiShow;
    var displayedNote;


    function getRandomMidiNote ()
    {
        var min = 21, max = 108;
        var randomIntInclusive = Math.floor (Math.random() * (max -min + 1)) + min;

        return randomIntInclusive;
    };


    function displayNewNote ()
    {
        displayedNote = getRandomMidiNote ();
        midiShow.displayPianoNote (displayedNote);
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


    function init ()
    {
        // canvas ID = 'noteShow', width = 400, scale = 1.5
        midiShow = new midiDisplay ('noteShow', 400, 1.5);

        // display first random note
        displayNewNote ();

        // initialize MIDI
        midiControl = new midiHandler (onMIDINote);
    };

    init ();
}];

midiApp.controller ('mainController', mainController);



