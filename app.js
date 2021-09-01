var hashrate;
var xmrPrice
var scrollY = 0;
var today = new Date()
var yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
yesterday = moment().format('DD-MM-YYYY');

$(window).on("load", $('#grid-container').addClass('active'));
$(window).on("load", setTheme());
$(".logo").hover(function() {
    $("#themeNotify").toggleClass('active')
});
$.getJSON(`https://localmonero.co/blocks/api/get_stats`, function(initialize) {
    height = initialize.height;
    hashrate = initialize.hashrate;
    Math.trunc(hashrate);
    hashrateMhs = hashrate / 1000000;
    //document.getElementById("hashrate").innerHTML = hashrateMhs.toFixed(2).concat(" Mh/s");
    getXMR();
    const fetchBlocks = async() => {
        for (let i = height; i >= (height - 25); i--) {
            await blockHeight(i);
        }
    };
    const blockHeight = async id => {
        const url = `https://monero.mycryptoapi.com/api/block/${id}`;
        const data = await fetch(url);
        const block = await data.json();
        $("#grid-container").append(`<div class="grid-item bHeight">${block.data.block_height}</div>`);
        $("#grid-container").append(`<div class="grid-item bTxs">${(block.data.txs.length) - 1}</div>`);
        $("#grid-container").append(`<div class="grid-item bHash hashHover truncate"onclick="showBlock('${block.data.hash}');setTimeout(temp, 100);">${block.data.hash}</div>`);
        $("#grid-container").append(`<div class="grid-item bAge truncate">${moment.unix(block.data.timestamp).startOf('seconds').fromNow()}</div>`);
    };
    fetchBlocks();
});

function showBlock(blockInput) {
    const getBlock = async() => {
        await blockData(blockInput);
    };
    const blockData = async blockInput => {
        const url2 = `https://monero.mycryptoapi.com/api/block/${blockInput}`;
        const data2 = await fetch(url2);
        const block2 = await data2.json();
        var temp;
        document.getElementById("grid-item-block-Block").innerHTML = ("Block: ").concat(block2.data.block_height);
        document.getElementById("grid-item-block-Hash").innerHTML = ("Hash: ").concat(block2.data.hash);
        document.getElementById("grid-item-block-SizekB").innerHTML = ((block2.data.size) / 1000).toString().concat(" kB");
        document.getElementById("grid-item-block-Coinbase").innerHTML = ("Coinbase Tx: ");
        document.getElementById("grid-item-block-CBHash").innerHTML = block2.data.txs[0].tx_hash;
        document.getElementById("grid-item-block-RewardAmount").innerHTML = ((block2.data.txs[0].xmr_outputs) / 1000000000000).toString().concat(" XMR");
        document.getElementById("grid-item-block-Transactions").innerHTML = (block2.data.txs.length - 1).toString().concat(" Transactions: ");
        $('<div/>', {
            id: 'grid-container-block',
            "class": 'grid-container-block',
        }).appendTo('#grid-container-block-section1');
        $("#grid-container-block").append(`<div class="grid-item-block b2Size">Hash</div>`);
        $("#grid-container-block").append(`<div class="grid-item-block b2Size">Size</div>`);
        for (let i = 1; i < block2.data.txs.length; i++) {
            temp = block2.data.txs[i].tx_hash;
            $("#grid-container-block").append(`<div class="grid-item-block b2Hash truncate"onclick="showTx('${block2.data.txs[i].tx_hash}');temp2()">${block2.data.txs[i].tx_hash}</div>`);
            $("#grid-container-block").append(`<div class="grid-item-block b2Size">${(block2.data.txs[i].tx_size) / 1000} kB</div>`);
        }
    };
    getBlock();
}

function showTx(txInput) {
    const getTx = async() => {
        await txData(txInput);
    };
    const txData = async txInput => {
        const url3 = `https://monero.mycryptoapi.com/api/transaction/${txInput}`;
        const data3 = await fetch(url3);
        const block3 = await data3.json();
        document.getElementById("grid-item-tx-txHash").innerHTML = txInput;
        document.getElementById("grid-item-tx-age").innerHTML = block3.data.timestamp_utc;
        document.getElementById("grid-item-tx-extra2").innerHTML = block3.data.extra;
        document.getElementById("grid-item-tx-BlockNumber").innerHTML = block3.data.block_height;
        document.getElementById("grid-item-tx-RingSize").innerHTML = block3.data.mixin;
        document.getElementById("grid-item-tx-FeeSize").innerHTML = ((block3.data.tx_fee) / 1000000000000).toString().concat(" per kB / ") + ((block3.data.tx_size) / 1000).toString().concat(" kB");
        document.getElementById("grid-item-tx-ConfirmationsAmount").innerHTML = block3.data.confirmations;
        $('<div/>', {
            id: 'grid-container-tx-section5',
            "class": 'grid-container-tx-section5',
        }).appendTo('#grid-container-tx-wrapper');
        $("#grid-container-tx-section5").append(`<div class="grid-item-tx-section5 grid-item-tx-section5-header">Key Image: </div>`);
        for (let i = 0; i < block3.data.inputs.length; i++) {
            $("#grid-container-tx-section5").append(`<div class="grid-item-tx-section5 truncate">${block3.data.inputs[i].key_image}</div>`);
        }
        $("#grid-container-tx-section5").append(`<div class="grid-item-tx-section5 grid-item-tx-section5-header">Stealth Address: </div>`);
        for (let i = 0; i < block3.data.outputs.length; i++) {
            $("#grid-container-tx-section5").append(`<div class="grid-item-tx-section5 truncate">${block3.data.outputs[i].public_key}</div>`);
        }
        $('.grid-container-tx-wrapper').addClass('active');
    };
    getTx();
}

function temp() {
    console.log(document.documentElement.getAttribute('data-theme'));
    $('#grid-container').removeClass('active');
    $('#backButton').addClass('active');
    $('#backMobile').addClass('active');
    $('#homeMobile').addClass('active');
    $('#grid-container-block-wrapper').addClass('active');
    scrollY = window.pageYOffset;
    $("html,body").animate({
        scrollTop: "0px"
    });
    $(window).on("load", $('#grid-container-tx-wrapper').removeClass('active'));
    $('#grid-container-tx-section5').remove();
    $('#grid-container-tx-section7').remove();
}

function temp2() {
    $('#grid-container').removeClass('active');
    $('#backButton').addClass('active');
    $('#backMobile').addClass('active');
    $('#homeMobile').addClass('active');
    $('#homeButton').addClass('active');
    $('#grid-container-block-wrapper').removeClass('active');
    $('#grid-container-tx-wrapper').addClass('active');
    $("html,body").animate({
        scrollTop: "0px"
    });
}

function showBlocks() {
    if ($('#grid-container-block-wrapper').hasClass('active')) {
        $('#grid-container').addClass('active');
        $('#backButton').removeClass('active');
        $('#backMobile').removeClass('active');
        $('#homeMobile').removeClass('active');
        $('#homeButton').removeClass('active');
        $('#grid-container-tx-wrapper').removeClass('active');
        $('#grid-container-block-wrapper').removeClass('active');
        setTimeout(removeTxList, 100);
        $('#grid-container-tx-section5').remove();
        $('#grid-container-tx-section7').remove();
        $("html, body").animate({
            scrollTop: scrollY.toString().concat("px")
        });
    } else {
        $('#homeButton').removeClass('active');
        $('#grid-container-block-wrapper').addClass('active');
        $('#grid-container-tx-wrapper').removeClass('active');
        $('#grid-container-tx-section5').remove();
        $('#grid-container-tx-section7').remove();
        $("html, body").animate({
            scrollTop: scrollY.toString().concat("px")
        });
    }
}

function home() {
    $('#backButton').removeClass('active');
    $('#homeButton').removeClass('active');
    $('#backMobile').removeClass('active');
    $('#homeMobile').removeClass('active');
    $('#grid-container-block-wrapper').removeClass('active');
    $('#grid-container-tx-wrapper').removeClass('active');
    $('#grid-container').addClass('active');
    $("html, body").animate({
        scrollTop: scrollY.toString().concat("px")
    });
}

function removeTxList() {
    $(".grid-container-block").remove();
}
$(window).scroll(function() {
    const backButton = document.getElementById("backButton");
    const homeButton = document.getElementById("homeButton");
    var style = getComputedStyle(backButton);
    var style2 = getComputedStyle(homeButton);
    var buttonTop = style.top;
    var homeTop = style.top;
    var currentPos = window.pageYOffset;
    if (currentPos < 120) {
        backButton.style.top = "266px";
        homeButton.style.top = "336px";
    } else {
        backButton.style.top = "50px";
        homeButton.style.top = "120px";
    }
});

function search(ele) {
    if (event.key === 'Enter') {
        var inputText = ele.value.trim();
        $.getJSON(`https://monero.mycryptoapi.com/api/block/${inputText}`, function(block) {
            if (block.data.hash != undefined) {
                removeTxList();
                showBlock(`${inputText}`);
                temp();
            } else {
                $.getJSON(`https://monero.mycryptoapi.com/api/transaction/${inputText}`, function(block2) {
                    if (block2.data.confirmations != undefined) {
                        $('#grid-container-tx-section5').remove();
                        $('#grid-container-tx-section7').remove();
                        showTx(`${inputText}`);
                        temp2();
                    } else {
                        warning();
                    }
                });
            }
        });
    }
}

function warning() {
    $('#error').addClass('active');
    setTimeout(removeWarning, 3500);
}

function removeWarning() {
    $('#error').removeClass('active');
}

function scrollUp() {
    $("html, body").animate({
        scrollTop: "0px"
    });
}

function setTheme() {
    if (document.documentElement.getAttribute('data-theme') == 'dark') {
        document.getElementById("themeText").innerHTML = "🌝 Switch Theme";
    } else {
        document.getElementById("themeText").innerHTML = "🌚 Switch Theme";
    }
}

function switchTheme() {
    if (document.documentElement.getAttribute('data-theme') == 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        document.getElementById("themeText").innerHTML = "🌚 Switch Theme";
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.getElementById("themeText").innerHTML = "🌝 Switch Theme";
    }
}

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 30) {
        $("header").addClass("active");
        $("#priceInfo").addClass("active");
        $(".logo").addClass("active");
        $(".input").addClass("active");
    } else {
        $("header").removeClass("active");
        $("#priceInfo").removeClass("active");
        $(".logo").removeClass("active");
        $(".input").removeClass("active");
    }
});

function getXMR() {
    $.getJSON(`https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd`, function(bPrice) {
        xmrPrice = bPrice.monero.usd;
        document.getElementById("xmrPrice").innerHTML = xmrPrice + "$";
        upOrDown();
    });
}

function upOrDown() {
    $.getJSON("https://api.coingecko.com/api/v3/coins/monero/history?date=" + yesterday, function(trend) {
        if (trend.market_data.current_price.usd <= xmrPrice) {
            document.getElementById('updown').innerHTML = "<i class=\"fas fa-caret-up\"></i>";
        } else {
            document.getElementById('updown').innerHTML = "<i class=\"fas fa-caret-down\"></i>";
        }
    });
}