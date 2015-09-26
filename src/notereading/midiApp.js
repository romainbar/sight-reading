
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
        // make the list of active notes
        var notes = [];

        var acc = $scope.accidentals;

        if ($scope.bassActive) {
            // octave 0
            if ($scope.bassC0) {
                notes = notes.concat ( [21, 23] ); // [A0, A0#]
                if (acc) notes = notes.concat ( [22] ); // [B0]
            }

            // octave 1: C1 to B1
            if ($scope.bassC1) {
                notes = notes.concat ( [24, 26, 28, 29, 31, 33, 35] );
                if (acc) notes = notes.concat ( [25, 27, 30, 32, 34] );
            }

            // octave 2: C2 to B2
            if ($scope.bassC2) {
                notes = notes.concat ( [36, 38, 40, 41, 43, 45, 47] );
                if (acc) notes = notes.concat ( [37, 39, 42, 44, 46] );
            }

            // octave 3: C3 to B3
            if ($scope.bassC3) {
                notes = notes.concat ( [48, 50, 52, 53, 55, 57, 59] );
                if (acc) notes = notes.concat ( [49, 51, 54, 56, 58] );
            }
        }

        if ($scope.trebleActive) {
            // octave 4: C4 to B4
            if ($scope.trebleC4) {
                notes = notes.concat ( [60, 62, 64, 65, 67, 69, 71] );
                if (acc) notes = notes.concat ( [61, 63, 66, 68, 70] );
            }

            // octave 5: C5 to B5
            if ($scope.trebleC5) {
                notes = notes.concat ( [72, 74, 76, 77, 79, 81, 83] );
                if (acc) notes = notes.concat ( [73, 75, 78, 80, 82] );
            }

            // octave 6: C6 to B6
            if ($scope.trebleC6) {
                notes = notes.concat ( [84, 86, 88, 89, 91, 93, 95] );
                if (acc) notes = notes.concat ( [85, 87, 90, 92, 94] );
            }

            // octave 7: C7 to B7
            if ($scope.trebleC7) {
                notes = notes.concat ( [96, 98, 100, 101, 103, 105, 107] );
                if (acc) notes = notes.concat ( [97, 99, 102, 104, 106] );
            }

            // octave 8: C8
            if ($scope.trebleC8) {
                notes = notes.concat ( [108] );
            }
        }

        var len = notes.length;
        if (len === 0) {
            // no note selected
            return false;
        }

        // randomly pick new note, different from displayed one
        var n = Math.floor (Math.random() * len);
        var randomIntInclusive = notes[n];

        while (len > 1 && randomIntInclusive === displayedNote) {
            n = Math.floor (Math.random() * len);
            randomIntInclusive = notes[n];
        }

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
            accidentals: $scope.accidentals,

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
            $scope.accidentals = conf.accidentals,

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
            $scope.accidentals = true;

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



