const merginValue = 20;
const fieldCardSpaceNum = 7;
var cardDeck = new playingCards();
var fieldCardArray = [];
// ドラッグするカード
var dragCard = null;

// 最初の場のカードを作成
for (let i = 0; i < fieldCardSpaceNum; i++) {
    let tmpArray = [];
    for (let j = 0; j < i + 1; j++) {
        let card = cardDeck.draw();
        tmpArray.push(card);
    }
    fieldCardArray.push(tmpArray);
}

$(document).ready(function () {

    cardDeck.shuffle();
    // let card = cardDeck.draw();

    // 場にカードを並べる
    let $fieldSpace = $("#fieldSpace");
    let $fieldCardSpace = $fieldSpace.children('div');
    $fieldCardSpace.each(function (index, element) {
        let cardArray = fieldCardArray[index];
        index++;
        for (let i = 0; i < index; i++) {
            console.log("index = " + index);
            console.log("i = " + i);
            // let card = cardDeck.draw();
            let card = cardArray[i];
            let $card = $(card.getHTML());
            $card.css("z-index", i);
            $card.css("position", "absolute");
            // 下にずらして並べる。marginを使用
            $card.css("margin-top", i * merginValue);

            if (i + 1 < index) {
                // 裏向きのカードは非表示
                $card.addClass("ura");
                // $cardContent = $card.children();
                // $cardContent.css("display", "none");
            }

            $(element).append($card);
        }
    });

    // 山札にカード配置
    let deck = $("#deck");
    deck.append('<div class="playingCard ura"></div>');
    // デッキがクリックされたら、カードを一枚めくる
    deck.on('click', function () {
        console.log("click!!");
        let openCard = $("#openedCard");
        openCard.empty();
        let card = cardDeck.draw();
        openCard.html(card.getHTML());

    });

    // $(".playingCard").draggable();
    // 表のカードだけ移動させるようにする。
    $(".playingCard:not(.ura)").draggable({
        start: function (event, ui) {
            console.log(event);
            console.log(ui);
            console.log(this);
            // 移動させるカードが一番上になるようにz-indexを設定
            $(this).css("z-index", 100);

            let spaceIndex = $(this).parent().index();
            let cardIndex = $(this).index();

            dragCard = fieldCardArray[spaceIndex][cardIndex];

        }
    });
    // ドロップも可能にする
    $(".playingCard:not(.ura)").droppable({
        drop: function (event, ui) {
            console.log("ドロップされました");
            console.log(event);
            console.log(ui);
            console.log(this);

            // ドロップしたカードを配置する
            let zIndex = Number(this.style.zIndex);
            let draggable = ui.draggable;
            console.log(draggable);
            $(this).parent().append(draggable);

            let index = draggable.index();
            // ドロップされた場所が何番目の場所かを表すインデックス
            let dropIndex = $(this).parent().index();

            // ドロップされたカード
            let droppedCard = fieldCardArray[dropIndex].slice(-1)[0];

            draggable.css('left', '');
            draggable.css('top', '');
            draggable.css('margin-top', index * merginValue);
            draggable.css('z-index', zIndex + 1);


        }
    });
});
