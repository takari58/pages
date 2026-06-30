// ランドマークごとのクイズ(17か所×3問)
const quizData = {
    "新発田城跡": [
        { q: "新発田城は春の花にちなんで別名「あやめ城」と呼ばれる", a: true },
        { q: "新発田城の屋根には二匹のシャチホコガ乗っている", a: false },
        { q: "新発田城は国の重要文化財に指定されている", a: true }
    ],
    "清水園": [
        { q: "清水園の中央にある大きな池は上から見ると「水」という文字をかたどっている", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "蔵春閣": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "東公園のSL": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "諏訪神社": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "市役所": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "王紋酒造": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "五十公野公園": [
        { q: "ダチョウを見ることができる", a: false },
        { q: "あやめの見頃は6月である", a: true },
        { q: "6月下旬の「しばたあやめまつり」では、ライトアップや露店を楽しむことができる", a: true }
    ],
    "カルチャーセンター": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "新発田駅": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "あやめの湯": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "イクネス": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "市民文化会館": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    "新発田歴史図書館": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    /*
    "元市役所": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
    */
    "新潟職能短大":[
        { q: "桜の木の数は25本以上である", a: true },
        { q: "学外の人は学食が食べられない", a: false },
        { q: "このアプリを作ったのは電子情報技術科の学生である", a: true }
    ],
    "菊水": [
        { q: "", a: true },
        { q: "", a: false },
        { q: "", a: true }
    ],
};

// ===== URL取得 =====
const params = new URLSearchParams(window.location.search);
const spotName = params.get("spot");

document.getElementById("title").textContent = spotName + " クイズ";

const quizzes = quizData[spotName];

let index = 0;    //問題数
let score = 0;    //正答数
const POINT = 20; //1問20点

// ===== 問題表示 =====
function showQuiz() {
    document.getElementById("result").textContent = "";
    document.getElementById("quizBox").textContent = quizzes[index].q;
}

showQuiz();

// ===== 回答 =====
function answer(userAnswer) {
    const correct = quizzes[index].a;

    if (userAnswer === correct) {
        document.getElementById("result").textContent = "正解！";
        score++;
    } else {
        document.getElementById("result").textContent = "不正解…";
    }

    index++;

    if (index < quizzes.length) {
        setTimeout(showQuiz, 1000);
    } else {
        showScore();
    }
}

// ===== スコア表示 =====
function showScore() {
    //クイズ画面を消す
    document.querySelector(".quiz-container").style.display = "none";

    //スコア表示画面
    document.getElementById("scoreScreen").classList.remove("hidden");
    
    const totalScore = score * POINT; // 点数計算

    document.getElementById("scoreText").textContent =
        `${quizzes.length}問中 ${score}問正解（${totalScore}点）`;

}
