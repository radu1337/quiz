// quiz module
(function() {
    var questions = [{
        question: "What special ability do you have?",
        choices: [1, 2, 3, 4, 5],
        choicesLabels: ["Flying", "Swimming", "Digging", "Running", "Climbing"]
    }, {
        question: "What territory do you come from?",
        choices: [1, 2, 3, 4, 5],
        choicesLabels: ["Plain", "Mountain", "Forest", "Arctic", "Grassland"]
    }, {
        question: "What animal are you?",
        choices: [1, 2, 3, 4, 5],
        choicesLabels: ["Butterfly", "Deer", "Lion", "Swan", "Zebra"],
        choicesImages: ["butterfly.jpg", "deer.jpg", "lion.jpg", "swan.jpg", "zebra.jpg"]
    }];

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var selectionsLabels = []; //Array containing user choice labels
    var quiz = $('#quiz'); //Quiz div object

    // Display initial question
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function(e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        choose();

        // If no user selection, progress is stopped
        if (isNaN(selections[questionCounter])) {
            alert('Please make a selection!');
        } else {
            questionCounter++;
            displayNext();
        }
    });

    // Click handler for the 'prev' button
    $('#prev').on('click', function(e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    // Click handler for the 'Start Over' button
    $('#start').on('click', function(e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        selections = [];
        selectionsLabels = [];
        displayNext();
        $('#start').hide();
    });



    // Creates and returns the div that contains the questions and
    // the answer selections
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<span class="question-label">Question ' + (index + 1) + ':</span>');
        qElement.append(header);

        var question = $('<span class="question-text">').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // assign click event for options
    $('.quiz').delegate('label','click',function() {
        $('.quiz ul li label').removeClass('active');
        $(this).addClass('active');
    });

    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
        var radioList = $('<ul>');
        var holder;
        var item;
        var input = '';
        var image = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            if (questions[index].choicesImages) {
                holder = $('<li class="with-image">');
            } else {
                holder = $('<li class="without-image">');
            }

            item = $('<label>');
            input = '<input type="radio" name="answer" value=' + questions[index].choices[i] + ' data-optionLabel="' + questions[index].choicesLabels[i] + '" />';
            input += questions[index].choicesLabels[i];

            if (questions[index].choicesImages) {
                image = '<img src="images/content/' + questions[index].choicesImages[i] + '" alt="'+ questions[index].choices[i] +'" />';
                item.append(image);
            }

            item.append(input);
            holder.append(item);
            radioList.append(holder);
        }

        return radioList;
    }

    // Reads the user selection and pushes the value to an array
    function choose() {
        var choiceLabelContent = $('input[name="answer"]:checked').attr('data-optionLabel');

        selections[questionCounter] = +$('input[name="answer"]:checked').val();
        selectionsLabels.push(choiceLabelContent);
    }

    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function() {
            $('#question').remove();

            if (questionCounter < questions.length) {
                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
                }
            } else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
            }
        });
    }

    // Combines choices and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p>', {
            id: 'question'
        });

        var givenAnswer = '';

        for (var i = 0; i < selections.length; i++) {
            givenAnswer = givenAnswer + ' ' + selectionsLabels[i];
        }

        score.append('You are a' + givenAnswer + ', congratulations!');
        return score;
    }
})();
