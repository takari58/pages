// ランドマークごとのクイズ(17か所×3問)
const quizData = {
    "新発田城跡": [
        { q: "新発田城は春の花にちなんで別名「あやめ城」と呼ばれる", a: true },
        { q: "新発田城の屋根には二匹のシャチホコガ乗っている", a: false },
        { q: "新発田城は国の重要文化財に指定されている", a: true }
    ],
    "清水園": [
        { q: "清水園の中央にある大きな池は上から見ると「水」という文字をかたどっている", a: true },
        { q: "清水園の庭園は、京都の金閣をまねて作られた", a: false },
        { q: "清水園は国の名勝に指定されている", a: true }
    ],
    "蔵春閣": [
        { q: "蔵春閣はもともと新発田市に建てられた建物である。", a: false },
        { q: "蔵春閣には、歴代総理大臣や渋沢栄一が訪れたとされている", a: true },
        { q: "蔵春閣は見学だけでなく、一部の部屋を借りて利用することができる", a: true }
    ],
    "東公園のSL": [
        { q: "このSLは明治時代、実際に羽越本線や信越本線で運行していた", a: true },
        { q: "このSLの名称は「D51」(デゴイチ)である", a: true },
        { q: "現在、自由に中へ入って運転することができる", a: false }
    ],
    "諏訪神社": [
        { q: "五穀豊穣・無病息災・学業成就などの御利益があると言われている", a: true },
        { q: "今の社殿は建立当時のまま、再建はされていない", a: false },
        { q: "諏訪神社は「おすわさま」という愛称で親しまれている", a: true }
    ],
    "市役所": [
        { q: "市役所の本庁舎は10階建てである", a: false },
        { q: "新発田市役所の本庁舎の愛称は「ヨリネスしばた」である", a: true },
        { q: "中心市街地の活性化のため移転が行われた", a: true }
    ],
    "王紋酒造": [
        { q: "王紋酒造には、創業200年以上の伝統がある", a: true },
        { q: "女人禁制と言われていた酒造りにいち早く女性蔵人を活用した", a: true },
        { q: "酒蔵は見学することができない", a: false },
    ],
    "五十公野公園": [
        { q: "ダチョウを見ることができる", a: false },
        { q: "あやめの見頃は6月である", a: true },
        { q: "6月下旬の「しばたあやめまつり」では、ライトアップや露店を楽しむことができる", a: true }
    ],
    "カルチャーセンター": [
        { q: "アリーナだけでなく、剣道場や柔道場、相撲場なども利用できる", a: true },
        { q: "カルチャーセンターにはプールがある", a: false },
        { q: "「全国うまいもん横丁」という食に関するイベントが開催される", a: true }
    ],
    "新発田駅": [
        { q: "新発田駅の開業は大正元年である", a: true },
        { q: "新発田駅には0番線は存在しない", a: false },
        { q: "現在の駅舎は新発田城をモチーフにしてデザインされている", a: true }
    ],
    "あやめの湯": [
        { q: "源泉かけ流しの温泉である", a: true },
        { q: "あやめの湯は宿泊施設である", a: false },
        { q: "足湯の利用は料金がかかる", a: false }
    ],
    "イクネスしばた": [
        { q: "イクネスしばたは学習・交流・図書館機能を持つ公共施設である", a: true },
        { q: "キッチンスタジオでは毎月料理教室が開催されている", a: true },
        { q: "こどもセンターには休館日はない", a: false }
    ],
    "市民文化会館": [
        { q: "落語会やコンサートなどのイベントが定期的に開催されている", a: true },
        { q: "市民文化会館の大ホールの座席数は約500席である", a: false },
        { q: "楽器の練習や活動に使用できる練習室がある", a: true }
    ],
    "新発田歴史図書館": [
        { q: "歴史関連の書籍・古文書だけでなく、浮世絵や古写真などの展示もされている", a: true },
        { q: "資料の貸し出しは行っていない", a: false },
        { q: "未来へ向けた新発田市の歴史の継承を行っている", a: true }
    ],
    "旧新発田市役所": [
        { q: "旧市役所は木造建築だった", a: false },
        { q: "旧市役所は老朽化や中心市街地の活性化のため移転した", a: false },
        { q: "2017年に現在の新発田市役所へ移転した", a: true }
    ],
    "新潟職能短大":[
        { q: "桜の木の数は25本以上である", a: true },
        { q: "学外の人は学食が食べられない", a: false },
        { q: "このアプリを作ったのは電子情報技術科の学生である", a: true }
    ],
    "菊水": [
        { q: "菊水酒造は明治時代に創業した酒蔵である", a: true },
        { q: "菊水日本酒文化研究所は一般公開されていない", a: false },
        { q: "麴や酒粕を利用したスイーツやオリジナルドリンクが楽しめるカフェがある", a: true }
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
