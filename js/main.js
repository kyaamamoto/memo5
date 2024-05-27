// グローバル変数
let count = 0;

// 画像のプレビュー表示
$('#imgUpload').on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Image = e.target.result;
            $('#preview').html(`<img src="${base64Image}" alt="Image Preview" style="max-width: 200px; height: auto;">`);
        };

        reader.readAsDataURL(file);
    }
});

// ファイルサイズを小さくする関数
function resizeFile(img, callback) {
    const canvas = document.createElement('canvas');
    const max_width = 600;
    const scaleSize = max_width / img.width;
    canvas.width = max_width;
    canvas.height = img.height * scaleSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL('image/png'));
}

// Saveボタンクリックイベント
$("#save").on("click", function() {
    const date = $("#date").val();
    const name = $("#namae").val();
    const hyouka = $("#hyouka").val();
    const tokucho = $("#tokucho").val();
    const file = $('#imgUpload')[0].files[0];

    if (!file) {
        alert("ファイルを選択してください");
        return;
    }

    const key = Date.now().toString(); // 一意のキーを生成

    const reader = new FileReader();
    reader.onload = function(event) {
        let base64Image = event.target.result;
        const filesize = file.size;

        if (filesize > 1000000) {
            const img = new Image();
            img.src = base64Image;
            img.onload = function() {
                resizeFile(img, function(resizedBase64Image) {
                    saveData(key, resizedBase64Image);
                });
            };
        } else {
            saveData(key, base64Image);
        }
    };

    reader.readAsDataURL(file);

    function saveData(key, base64Image) {
        const memo = {
            'date': date,
            'file': base64Image,
            'name': name,
            'hyouka': hyouka,
            'tokucho': tokucho
        };

        try {
            localStorage.setItem(key, JSON.stringify(memo));

            const html = `
                <li id="item-${key}">
                    <p>${memo.date}</p>
                    <p><img src="${memo.file}" alt="Saved Image" style="max-width: 200px; height: auto;"></p>
                    <p>${memo.name}</p>
                    <p>${memo.hyouka}</p>
                    <p>${memo.tokucho}</p>
                    <div class="item-btn-wrap">
                        <button class="delete-btn" data-id="${key}">削除</button>
                    </div>
                </li>
            `;
            $("#list").append(html);

            $("#date").val("");
            $("#namae").val("");
            $("#hyouka").val("");
            $("#tokucho").val("");
            $("#imgUpload").val("");
            $('#preview').html("");

        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('容量を超えたため保存できません。保存したい場合は先に他のファイルを削除してください。');
            } else {
                alert('不明なエラーが発生しました: ' + e.message);
            }
        }
    }
});

// ページ読み込み時に保存データを取得表示
$(document).ready(function() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const result = JSON.parse(localStorage.getItem(key));

        let html = `
            <li id="item-${key}">
                <p>${result.date}</p>
                <p><img src="${result.file}" alt="Saved Image" style="max-width: 200px; height: auto;"></p>
                <p>${result.name}</p>
                <p>${result.hyouka}</p>
                <p>${result.tokucho}</p>
                <div class="item-btn-wrap">
                    <button class="delete-btn" data-id="${key}">削除</button>
                </div>
            </li>
        `;
        $("#list").append(html);
    }
});

// クリックしたものだけ削除
$("#list").on("click", ".delete-btn", function() {
    if (!confirm("削除してもよろしいですか？")) {
        return false;
    } else {
        let deleteId = $(this).data('id');
        console.log(deleteId, "deleteId取れてるか");

        $(`#item-${deleteId}`).remove();
        localStorage.removeItem(deleteId);

        // localStorageにデータがなくなっていたらnofileを出す
        const keys = Object.keys(localStorage);
        if (keys.length === 0) {
            $(".nofile").css("display", "block");
        }
    }
});

// //全削除
// //2.clear クリックイベント
// $("#clear").on("click", function(){
//     localStorage.clear();
//     $("#list").empty();
// });

//全削除
//2.clear クリックイベント
$("#clear").on("click", function(){
    if(!confirm("全て削除してもよろしいですか？")) {
        return false;
    }else { let deleteId = $(this).data('id');
    console.log(deleteId, "deleteId取れてるか");

    }
    localStorage.clear();
    $("#list").empty();
});