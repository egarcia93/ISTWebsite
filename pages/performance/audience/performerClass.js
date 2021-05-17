class Performer {
    constructor(data) {
        this.name = data.name;
        this.synth = data.synth;
        this.synthSetting = data.synthSetting;
        this.controls = data.controls;
        this.id = data.socketID;
        this.instrument;
        this.note = [];
        this.volume;
        this.distortion;
        this.duration = '4n';
        this.feedbackDelay;
        this.meter;
        this.waveform;
        this.buffer;
        this.chorus;
        this.pingPong
    }

    //GO THROUGH SETTINGS, CREATE INSTRUMENT, AND IDENTIFY WHAT ASPECTS OF THE INSTRUMENT WILL BE CONTROLLED
    setupInstrument() {
            // //CREATE SYNTH FROM data.synthSetting
            this.meter = new Tone.Meter().toDestination();
            this.volume = new Tone.Volume(0).connect(this.meter);
            this.feedbackDelay = new Tone.FeedbackDelay().connect(this.volume);
            this.chorus = new Tone.Chorus().connect(this.feedbackDelay);
            this.distortion = new Tone.Distortion().connect(this.chorus);
            this.waveform = new Tone.Waveform().connect(this.distortion);
            let synthType = "new Tone." + this.synthSetting + ".connect(this.waveform)";
            this.instrument = eval(synthType);

            // //LOOP THROUGH data.controls TO GET PARTS OF SYNTH TO CONTROL
            for (i = 0; i < this.controls.length; i++) {
                if (this.controls[i].name === "pitch") {
                    //ADD this.controls[i].target
                    this.controls[i].target = "this.note";
                }
                if (this.controls[i].name === "volume") {
                    //ADD this.controls[i].target and set initial value
                    this.controls[i].target = "this.volume.volume.value";
                    this.volume.volume.value = this.controls[i].startVal;
                }
                if (this.controls[i].name === "duration") {
                    //ADD this.controls[i].target and set initial value
                    this.controls[i].target = "this.duration";
                    this.duration = this.controls[i].startVal;
                }
                if (this.controls[i].name === "delay") {
                    //ADD this.controls[i].target and set initial value
                    this.controls[i].target = "this.feedbackDelay.delayTime.value";
                    this.feedbackDelay.delayTime.value = this.controls[i].startVal;
                }
                if (this.controls[i].name === "feedback") {
                    //ADD this.controls[i].target and set initial value
                    this.controls[i].target= "this.feedbackDelay.feedback.value";
                    this.feedbackDelay.feedback.value = this.controls[i].startVal
                }
                //ENVELOPE FOR THOSE USING SAMPLER
                if (this.controls[i].name === "envelope") {
                    //ADD this.controls[i].target and set initial value
                    // this.controls[i].target = "this.instrument.envelope";
                    this.instrument.attack = this.controls[i].attack;
                    this.instrument.decay = this.controls[i].decay;
                    this.instrument.sustain = this.controls[i].sustain;
                    this.instrument.release = this.controls[i].release;
                }
                if (this.controls[i].name === "chorus") {
                    this.chorus.frequency.value = this.controls[i].frequency;
                    this.chorus.delayTime = this.controls[i].delayTime;
                    this.chorus.depth = this.controls[i].depth;
                }
                if (this.controls[i].name === "distortion") {
                    //ADD this.controls[i].target and set initial value
                    this.controls[i].target = "this.distortion.distortion";
                    this.distortion.distortion = this.controls[i].startVal;
                }
            }
        ready = true;
    }

    checkData(data) {
        //IDENTIFY WHAT IS GOING TO BE CONTROLLED
        for (i = 0; i < this.controls.length; i++) {
            if (data.hasOwnProperty(this.controls[i].name)) {                
                //MATCH DATA CHANGE WITH WHAT IS BEING CONTROLLED
                // console.log(this.controls[i].target + " = " + data[this.controls[i].name]);
                eval(this.controls[i].target + " = " + data[this.controls[i].name]);
                // console.log(eval(this.controls[i].target));
                if (this.controls[i].name === "pitch") {
                    this.playSound();
                }
            }
        }
    }

    playSound() {
        // console.log(this.instrument);
        this.instrument.triggerAttackRelease(this.note, this.duration);
    }
}