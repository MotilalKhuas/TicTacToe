// ********************** ALL GLOBAL VARIABLES/OBJECTS DECLARATIONS ***********************
// ****************************************************************************************
const turn_indicator = document.getElementById("turn_indicator").querySelector("span");
const reset_btn = document.getElementById("reset_btn").querySelector("button");
const buttons = document.getElementById("buttons_container").querySelectorAll("button");
const score_boxes = document.getElementById("footer_container").querySelectorAll(".score")

const modal_cancel_btns = document.querySelectorAll(".cancel_btn");
let restart_btn = document.querySelectorAll(".restart_btn");

const confirm_modal = document.getElementById("confirm_modal");

const new_game_modal = document.getElementById("new_game_modal");
const new_game_modal_start_btn = new_game_modal.querySelector(".new_game_btn");
const input_field = new_game_modal.querySelector("input");
const error_symbol = document.getElementById("error_symbol");
const error_msg = document.getElementById("error_msg")

const game_over_modal = document.getElementById("game_over_modal");
const winning_player = game_over_modal.querySelector("#victory_msg").querySelectorAll("span")[0];
const winning_msg = game_over_modal.querySelector("#victory_msg").querySelectorAll("span")[1];

const overlay = document.getElementById("overlay");

const winning_pattern = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
]

let isO = true;
let o_count = 0;
let x_count = 0;
let o_win_count = 0;
let x_win_count = 0; 
let ties_count = 0

let total_rounds = 0;
let current_round = 1;


// ************************** ALL HELPING FUNCTION DECLARATIONS ***************************
// ****************************************************************************************
function updateTurnIndicator(){
    turn_indicator.textContent = isO ? "O" : "X";
}


function highlightWinningButtons(winningButtons, winner){
    winningButtons.forEach((btn)=>{
        btn.className = "victory_boxes";
        btn.style.backgroundColor = winner === "O" ? "#f2b137" :  "#31c3bd";
    });
}


function updatePlayAreaAndScore(o_win, x_win, ties){
    buttons.forEach(btn=>{
        btn.textContent = "";
        btn.disabled = false;
        btn.className = "";
        btn.style.backgroundColor = "";
    });

    o_count = x_count = 0;
    [o_win_count, x_win_count, ties_count] = [o_win, x_win, ties];
    isO = true;

    score_boxes.forEach((box, index)=>{
        let result_value = box.querySelector("span");
        if(index == 0) result_value.textContent = x_win;
        else if(index == 1) result_value.textContent = ties;
        else if(index == 2) result_value.textContent = o_win;
    });

    updateTurnIndicator();
}


function gameOver(){
    let winner = "";
    if(o_win_count > x_win_count) winner = "O";
    else if(o_win_count < x_win_count) winner = "X";
    
    winning_player.className = winner === "O" ? "circle_color" : "cross_color";
    winning_player.textContent = winner;

    winning_msg.textContent = winner ? "WON THE MATCH" : "OOPS IT'S A TIE"

    const result_table_scores = game_over_modal.querySelectorAll("#result_table tr td:nth-child(2)");
    let [elem1, elem2, elem3] = result_table_scores;

    [elem1.textContent, elem2.textContent, elem3.textContent] = [x_win_count, o_win_count, ties_count];

    game_over_modal.classList.add("active");
    overlay.classList.add("active");
}


function checkRoundWinner(){
    for(let pattern of winning_pattern){
        let [a, b, c] = pattern;
        let [text_1, text_2, text_3] = [buttons[a].textContent, buttons[b].textContent, buttons[c].textContent];
        let is_current_round_completed = false;

        if(text_1 && text_1 === text_2 && text_1 === text_3){
            highlightWinningButtons([buttons[a], buttons[b], buttons[c]], text_1);
            buttons.forEach(btn=>btn.disabled = true);

            text_1 === "O" ? o_win_count++ : x_win_count++;
            is_current_round_completed = true;
        }
        else{
            if((o_count + x_count) === 9){
                ties_count++;
                is_current_round_completed = true;
            }
        }

        if(is_current_round_completed){
            setTimeout(()=>{
                if(current_round === total_rounds){
                    gameOver();
                    updatePlayAreaAndScore(0, 0, 0);
                }
                else{
                    updatePlayAreaAndScore(o_win_count, x_win_count, ties_count);
                }
                current_round++;
            }, 1000);
            return;
        }
    }
}


function handlePlayButtonClick(event){

    const btn = event.target;

    btn.textContent = isO ? "O" : "X";
    btn.className = isO ? "circle_color" : "cross_color";

    isO ? o_count++ : x_count++;
    isO = !isO;
    btn.disabled = true;

    if(o_count > 2 || x_count > 2){
        checkRoundWinner();
    }
    updateTurnIndicator();
}




// ************************************ EVENT HANDLERS ************************************
// ****************************************************************************************
updateTurnIndicator();

setTimeout(()=>{
    input_field.value = 1;
    new_game_modal.classList.add("active");
    overlay.classList.add("active");
})

buttons.forEach((btn)=>btn.addEventListener("click", handlePlayButtonClick));

reset_btn.onclick = function(){
    confirm_modal.classList.toggle("active");
    overlay.classList.toggle("active");
};

modal_cancel_btns.forEach((btn)=>{
    btn.onclick = function(){
        btn.closest(".modal").classList.remove("active");
        overlay.classList.remove("active");
    }
});

restart_btn.forEach((btn)=>{
    btn.onclick = function(){
        input_field.value = 1;
        new_game_modal.classList.add("active");
        this.closest(".modal").classList.remove("active");
    };
})

new_game_modal_start_btn.onclick = function(){
    total_rounds = Number(input_field.value);

    if(input_field.value === ""){
        error_symbol.textContent = "❌";
        error_msg.textContent = "PLEASE ENTER A VALID NUMBER"
        return;
    }
    else if(total_rounds < 1){
        error_symbol.textContent = "❌";
        error_msg.textContent = "VALUE SHOULD BE GREATER THAN 0"
        return;
    }
    
    error_symbol.textContent = "";
    error_msg.textContent = "";

    current_round = 1;
    updatePlayAreaAndScore(0, 0, 0);
    this.closest(".modal").classList.remove("active");
    overlay.classList.remove("active");
};