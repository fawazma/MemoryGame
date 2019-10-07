const card_svg = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8"];

var app = new Vue({
    el: '#app',
    data: {
        cardimages: card_svg,    // card image source array
        fliped: false,     // if user flip the first card
        reseted: false,    // card matched or not
        temp1: null,    // value of the first card
        temp2: null,     // value of the second card 
        target1: null,   // dom element of first card
        target2: null,   // dom element of second card
        moved: 0,     // current number of moves
        time: 0,     // current time (second)
        clock: '',       // timer interval
        timer: '00:00:00',    //current time (hh:mm:ss)
        started: false,    // game started or not
        total_match: 8,     // total card match
        card_matched: 0    // current card matched
    },
    methods: {
        flip: function (id, event) {
            if (!this.started) {     // start timer when user start the game
                this.started = true;

                this.clock = setInterval(function () {
                    this.time = Number(this.time) + Number('1');
                    this.timer = this.timeconvert();
                }.bind(this), 1000);
            }
            if (this.reseted) {
                target = event.target;
                if (this.fliped) {
                    this.target2 = $(target);
                    this.temp2 = id;
                } else {
                    this.fliped = true;
                    this.target1 = $(target);
                    this.temp1 = id;
                }
                $(target).parent().addClass('open');        // flip selected card
                if (this.temp1 == this.temp2) {            // match two card if user select same image
                    this.moved += 1;
                    this.reseted = false;
                    this.card_matched += 1;
                    this.target2.parent().addClass('matched');
                    this.target1.parent().addClass('matched');
                    if (this.card_matched == this.total_match) {
                        this.endgame()
                    }
                    this.matched();
                } else if (this.temp2 != null) {    // if user select different image, unflip two cards again
                    this.moved += 1;
                    this.reseted = false;
                    let item1 = this.target1;
                    let item2 = this.target2;
                    this.matched();
                    setTimeout(function () {
                        this.unflip(item1, item2);
                    }.bind(this), 500);
                }
            }
        },
        matched: function () {       // if user select correct image, format temp values
            this.fliped = false;
            this.temp1 = null;
            this.temp2 = null;
            this.target1 = null;
            this.target2 = null;
            this.reseted = true;
        },
        unflip: function (item1, item2) {    // if user select different image, unflip cards again
            item1.parent().removeClass('open');
            item2.parent().removeClass('open');
        },
        draw: function () {   // randomly shußes the cards
            let i = card_svg.length;
            while (--i > 0) {
                const j = Math.floor(Math.random() * (i + 1));
                const val = card_svg[j];
                card_svg[j] = card_svg[i];
                card_svg[i] = val;
            }
            this.reseted = true;
            this.matched();
            this.cardimages = card_svg;
        },
        restart: function () {         //restart game   format all values.
            $('.card').removeClass('open');
            $('.card').removeClass('matched');
            this.draw();
            this.moved = 0;
            clearInterval(this.clock);
            this.time = 0;
            this.timer = '00:00:00';
            this.started = false;
            this.card_matched = 0;
        },
        timeconvert: function () {       // convert second time to h:m:s time
            let time_seconds = this.time;
            var hours = Math.floor(time_seconds / 3600);
            var minutes = Math.floor((time_seconds - (hours * 3600)) / 60);
            var seconds = time_seconds - (hours * 3600) - (minutes * 60);
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return hours + ':' + minutes + ':' + seconds;
        },
        endgame: function () {    //show modal when a user wins the game
            let start_review = "";
            if (this.moved > 20) {
                start_review = `
                    <li><i class="fas fa-star"></i></li>
                    <li class="empty-star"><i class="fas fa-star"></i></li>
                    <li class="empty-star"><i class="fas fa-star"></i></li>
                `;
            } else if (this.moved > 10) {
                start_review = `
                    <li><i class="fas fa-star"></i></li>
                    <li><i class="fas fa-star"></i></li>
                    <li class="empty-star"><i class="fas fa-star"></i></li>
                `;
            } else {
                start_review = `
                    <li><i class="fas fa-star"></i></li>
                    <li><i class="fas fa-star"></i></li>
                    <li><i class="fas fa-star"></i></li>
                `;
            }
            Swal.fire({        //show modal using sweetalert plugin
                title: 'Congratulations!',
                html: `
                <div class="game-rate">
                    <ul>
                        ` + start_review + `
                    </ul>
                    <p class="move_count"><span>` + this.moved + `</span><span> Moves</span></p>
                </div>
                <br>
                <div class="timer text-center font-weight-bold">
                    <i class="far fa-clock"></i>
                    <span>` + this.timer + `</span>
                    <i class="far fa-clock"></i>
                </div>
                `,
                type: 'success',
                confirmButtonText: 'Ok'
            })
            this.restart();    //reset game
        }
    },
    created() {
        this.draw();   // randomly shußes the cards
        let _this = this;

        // Restart game when user click ESC keyboard
        $(document).keyup(function (e) {
            if (e.keyCode == "27") {
                _this.restart();
            }
        })
    }
})