
var midiApp = angular.module ('midiModule', []);


function configuration (storageName)
{
    this.loadStructure = function()
    {
        var item = localStorage.getItem (storageName);
        if (item === null) {
                return false;
        }

        return JSON.parse (item);
    }

    this.saveStructure = function (structure)
    {
        localStorage.setItem (storageName, JSON.stringify (structure));
    }
};


var mainController = ['$scope', function ($scope)
{
    var midiControl;
    var midiShowTreble;
    var midiShowBass;
    var displayedNote;
    var configurationHandler = new configuration ('midiNoteReading');


    function getRandomMidiNote()
    {
        // make the list of active ranges
        var ranges = [];

        if ($scope.bassActive) {
            // A0 to B0
            if ($scope.bassC0) ranges.push ( [21, 23] );
            // C1 to B1
            if ($scope.bassC1) ranges.push ( [24, 35] );
            // C2 to B2
            if ($scope.bassC2) ranges.push ( [36, 47] );
            // C3 to B3
            if ($scope.bassC3) ranges.push ( [48, 59] );
        }

        if ($scope.trebleActive) {
            // C4 to B4
            if ($scope.trebleC4) ranges.push ( [60, 71] );
            // C5 to B5
            if ($scope.trebleC5) ranges.push ( [72, 83] );
            // C6 to B6
            if ($scope.trebleC6) ranges.push ( [84, 95] );
            // C7 to B7
            if ($scope.trebleC7) ranges.push ( [96, 107] );
            // C8
            if ($scope.trebleC8) ranges.push ( [108, 108] );
        }

        if (ranges.length === 0) {
            // no octave selected
            return false;
        }

        // randomly select an active range
        var n = Math.floor (Math.random() * ranges.length);
        var selectedRange = ranges[n];

        // randomly pick note within range
        var min = selectedRange[0], max = selectedRange[1];
        var randomIntInclusive = Math.floor (Math.random() * (max - min + 1)) + min;

        return randomIntInclusive;
    };


    function displayNewNote()
    {
        displayedNote = getRandomMidiNote();

        if (!displayedNote) {
            midiShowTreble.displayStaffNotes (false, 'treble');
            midiShowBass.displayStaffNotes (false, 'bass');
        } else if (displayedNote >= 60) {
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
                $scope.result = 'Correct!';
                $scope.resultClass = 'success';
                displayNewNote();
            } else {
                $scope.result = 'ERROR :-(';
                $scope.resultClass = 'error';
            }

            // force Angular refresh
            $scope.$apply();
        }
    };


    function saveConfiguration()
    {
        var conf = {
            trebleActive: $scope.trebleActive,
            bassActive: $scope.bassActive,

            trebleC4: $scope.trebleC4,
            trebleC5: $scope.trebleC5,
            trebleC6: $scope.trebleC6,
            trebleC7: $scope.trebleC7,
            trebleC8: $scope.trebleC8,

            bassC0: $scope.bassC0,
            bassC1: $scope.bassC1,
            bassC2: $scope.bassC2,
            bassC3: $scope.bassC3
        };

        configurationHandler.saveStructure (conf);
    };


    function loadConfiguration()
    {
        var conf = configurationHandler.loadStructure();

        if (conf) {
            // set retrieved values
            $scope.trebleActive = conf.trebleActive;
            $scope.bassActive = conf.bassActive;

            $scope.trebleC4 = conf.trebleC4;
            $scope.trebleC5 = conf.trebleC5;
            $scope.trebleC6 = conf.trebleC6;
            $scope.trebleC7 = conf.trebleC7;
            $scope.trebleC8 = conf.trebleC8;
            $scope.bassC0 = conf.bassC0;
            $scope.bassC1 = conf.bassC1;
            $scope.bassC2 = conf.bassC2;
            $scope.bassC3 = conf.bassC3;
        } else {
            // both staves active by default
            $scope.trebleActive = true;
            $scope.bassActive = true;

            // all octaves active by default
            $scope.trebleC4 = true;
            $scope.trebleC5 = true;
            $scope.trebleC6 = true;
            $scope.trebleC7 = true;
            $scope.trebleC8 = true;
            $scope.bassC0 = true;
            $scope.bassC1 = true;
            $scope.bassC2 = true;
            $scope.bassC3 = true;
        }
    };


    $scope.configurationChange = function()
    {
        // resfresh note
        displayNewNote();

        // save configuration
        saveConfiguration();
    }


    function init()
    {
        loadConfiguration();

        // canvas ID = 'noteShow', width = 400, scale = 1.5
        midiShowTreble = new midiDisplay ('trebleCanvas', 400, 1.5);
        midiShowBass = new midiDisplay ('bassCanvas', 400, 1.5);

        // display first random note
        displayNewNote();

        // initialize MIDI
        midiControl = new midiHandler (onMIDINote);
    };

    init();
}];

midiApp.controller ('mainController', mainController);



