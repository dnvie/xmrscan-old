var topOfPageTx = false;
var topOfPageDetails = false;
var onMain = true;
var onMempool = false;
var baseUrl = "https://xmrchain.net/"

function txPopUp() {
    $('.txPopUp').addClass('active');
    $('.blockPopUp').addClass('unfocused');
    $('.progressBarBlock').addClass('unfocused');
    $('.txBackground').addClass('active');
    $('.progressBarTx').addClass('active');
    document.getElementById("progressBarTxHeader").style.width = 0 + "%";
    topOfPageTx = true;
    onMain = false;
};

function detailsPopUp() {
    $('.txPopUp').addClass('unfocusable');
    $('.detailsPopUp').addClass('active');
    $('.txPopUp').addClass('active');
    $('.blockPopUp').addClass('unfocusedAgain');
    $('.progressBarBlock').addClass('unfocusedAgain');
    $('.txPopUp').addClass('unfocused');
    $('.detailsBackground').addClass('active');
    $('.progressBarTx').addClass('unfocused');
    $('.progressBarDetails').addClass('active');
    setTimeout(removeUnfocusableTx, 200);
    topOfPageDetails = true;
    onMain = false;
};

function removeDetails() {
    $('.detailsPopUp').removeClass('active');
    $('.txPopUp').addClass('active');
    $('.txPopUp').removeClass('unfocused');
    $('.blockPopUp').removeClass('unfocusedAgain');
    $('.progressBarBlock').removeClass('unfocusedAgain');
    $('.blockPopUp').addClass('unfocused');
    $('.detailsBackground').removeClass('active');
    $('.detailsEntry').remove();
    $('.progressBarTx').removeClass('unfocused');
    $('.progressBarDetails').removeClass('active');
    document.getElementById("progressBarDetailsHeader").style.width = 0 + "%";
    onMain = false;
}

function removeDetailsMempool() {
    $('.detailsPopUp').removeClass('active');
    $('.blockPopUp').removeClass('unfocusedAgain');
    $('.progressBarBlock').removeClass('unfocusedAgain');
    $('.blockPopUp').addClass('unfocused');
    $('.detailsBackground').removeClass('active');
    $('.detailsEntry').remove();
    $('.progressBarTx').removeClass('unfocused');
    $('.progressBarDetails').removeClass('active');
    $('.mempool').removeClass('unfocused');
    $('.progressBarMempool').removeClass('unfocused');
    document.getElementById("progressBarDetailsHeader").style.width = 0 + "%";
    onMain = false;
}

function removeTx() {
    $('.txPopUp').removeClass('active');
    $('.blockPopUp').removeClass('unfocused');
    $('.mainText').removeClass('active');
    $('.txBackground').removeClass('active');
    $('.txEntry').remove();
    $('.progressBarBlock').removeClass('unfocused');
    $('.progressBarTx').removeClass('active');
    onMain = true;
}

function mempoolTx() {
    $('.detailsPopUp').addClass('active');
    $('.blockPopUp').addClass('unfocusedAgain');
    $('.progressBarBlock').addClass('unfocusedAgain');
    $('.detailsBackground').addClass('active');
    $('.progressBarTx').addClass('unfocused');
    $('.progressBarDetails').addClass('active');
    $('.mempool').addClass('unfocused');
    $('.progressBarMempool').addClass('unfocused'); 
    setTimeout(removeUnfocusableTx, 200);
    topOfPageDetails = true;
    onMain = false;
}

function removeAll() {
    setTimeout(removeDetails, 50);
    setTimeout(removeTx, 100);
    setTimeout(resetInactive, 1);
    setTimeout(removeSC, 1);
    $('.searchBar').val('');
    onMain = true;
    onMempool = false;
}

function removeUnfocusableTx() {
    $('.txPopUp').removeClass('unfocusable')
};

function detailsPopUpHelper() {
    setTimeout(detailsPopUp, 1);
}

function mempoolTxHelper() {
    setTimeout(mempoolTx, 1);
}

function removeTxHelper() {
    setTimeout(removeTx, 1);
}

function removeDetailsHelper() {
    if(onMempool) {
        console.log(onMempool)
        setTimeout(removeDetailsMempool, 1);
    } else {
        console.log(onMempool)
        setTimeout(removeDetails, 1);
    }
}

function removeSC() {
    $('.searchContainer').removeClass('active');
}


function resetInactive() {
    $('.detailsBackground').removeClass('inactive');
}


function getXMR() {
    $.getJSON(`https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd`, function(bPrice) {
        xmrPrice = bPrice.monero.usd;
        document.getElementById("xmrPrice").innerHTML = xmrPrice + "$";
        document.getElementById("xmrPrice2").innerHTML = xmrPrice + "$";
        upOrDown();
    });
}

function upOrDown() {
    $.getJSON("https://api.coingecko.com/api/v3/coins/monero/history?date=" + yesterday, function(trend) {
        if (trend.market_data.current_price.usd <= xmrPrice) {
            document.getElementById('updown').innerHTML = "<i class=\"fas fa-caret-up\"></i>";
            document.getElementById('updown2').innerHTML = "<i class=\"fas fa-caret-up\"></i>";
        } else {
            document.getElementById('updown').innerHTML = "<i class=\"fas fa-caret-down\"></i>";
            document.getElementById('updown2').innerHTML = "<i class=\"fas fa-caret-down\"></i>";
        }
    });
}


var hasrate, counter, xmrPrice, tempLink, tempString;
var today = new Date();
var yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
yesterday = moment().format('DD-MM-YYYY');

$.getJSON(baseUrl + `api/mempool`, function(mempool) {
    var length = mempool.data.txs_no;
    console.log("len: " + length);

    const getMempool = async() => {
        counter = 0;
        for (let i = 0; i < length; i++) {
            await fetchMempool(i);
            counter++;
        }
    };
    const fetchMempool = async id => {
        var functioncall = "onclick=\"showTx(" + mempool.data.txs[id].tx_hash + ")\"";
        $(".mempool-grid-container").append(`<div id="mempool-gridItem1${id}" class="grid-item bHeight mainText">`+ mempool.data.txs[id].tx_size + " kB" +`</div>`);
        $("#mempool-grid-container").append(`<div id="mempool-gridItem2${id}" class="grid-item bHash hashHover truncate mainText" onclick="showTxMempool('${mempool.data.txs[id].tx_hash}')">${mempool.data.txs[id].tx_hash}</div>`);
        $("#mempool-grid-container").append(`<div id="mempool-gridItem3${id}" class="grid-item bAge mainText truncate">`+ moment.unix(mempool.data.txs[id].timestamp).startOf('seconds').fromNow() +`</div>`);
    };
    getMempool();

});

$.getJSON(baseUrl + `api/networkinfo`, function(initialize) {
    height = initialize.data.height - 1;
    console.log(height);
    getXMR();
    setInterval(getXMR, 10000);

    for (let x = 0; x <= 50; x++) {
        $(".grid-container").append(`<div id="gridItem1${x}" class="blur grid-item bHeight mainText"></div>`);
        $("#grid-container").append(`<div id="gridItem2${x}" class="blur grid-item bTxs mainText"></div>`);
        $("#grid-container").append(`<div id="gridItem3${x}" class="blur grid-item bHash hashHover truncate mainText"></div>`);
        $("#grid-container").append(`<div id="gridItem4${x}" class="blur grid-item bAge mainText truncate"></div>`);
        $(`#gridItem1${x}`).html("2549415");
        $(`#gridItem2${x}`).html("13");
        $(`#gridItem3${x}`).html("e808b9b4975ed50603fba0eaceb7176a7edb4740982006379d199963543be03b");
        $(`#gridItem4${x}`).html("4 minutes ago");
    }

    const fetchBlocks = async() => {
        counter = 0;
        for (let i = height; i >= (height - 50); i--) {
            await blockHeight(i);
            counter++;
        }
    };
    const blockHeight = async id => {
        const url = baseUrl + `api/block/${id}`;
        const data = await fetch(url);
        const block = await data.json();

        $(`#gridItem1${counter}`).html(block.data.block_height);
        $(`#gridItem2${counter}`).html((block.data.txs.length) - 1);
        $(`#gridItem3${counter}`).html(block.data.hash);
        tempLink = $(`#gridItem3${counter}`).html();
        tempString = "showBlock('" + tempLink + "')"
        $(`#gridItem3${counter}`).attr("onclick", tempString);
        $(`#gridItem4${counter}`).html(moment.unix(block.data.timestamp).startOf('seconds').fromNow());
        $(`#gridItem1${counter}`).removeClass('blur');
        $(`#gridItem2${counter}`).removeClass('blur');
        $(`#gridItem3${counter}`).removeClass('blur');
        $(`#gridItem4${counter}`).removeClass('blur');

    };
    fetchBlocks();
});

function showBlock(blockInput) {
    txPopUp();
    const getBlock = async() => {
        await blockData(blockInput);
    };
    const blockData = async blockInput => {
        const url2 = baseUrl + `api/block/${blockInput}`;
        const data2 = await fetch(url2);
        const block2 = await data2.json();
        var temp;
        document.getElementById("grid-item-block-Block").innerHTML = ("Block: ").concat(block2.data.block_height);
        document.getElementById("grid-item-block-Hash").innerHTML = ("Hash: ").concat(block2.data.hash);
        document.getElementById("grid-item-block-SizekB").innerHTML = ((block2.data.size) / 1000).toString().concat(" kB");
        document.getElementById("grid-item-block-CBHash").innerHTML = block2.data.txs[0].tx_hash;
        document.getElementById("grid-item-block-RewardAmount").innerHTML = ((block2.data.txs[0].xmr_outputs) / 1000000000000).toString().concat(" XMR");
        document.getElementById("grid-item-block-Transactions").innerHTML = (block2.data.txs.length - 1).toString().concat(" Transactions: ");
        for (let i = 1; i < block2.data.txs.length; i++) {
            temp = block2.data.txs[i].tx_hash;
            $(".tx-grid").append(`<div class="tx-grid-item tx-grid-hash txEntry truncate" onclick="showTx('${block2.data.txs[i].tx_hash}')">${block2.data.txs[i].tx_hash}</div>`);
            $(".tx-grid").append(`<div class="tx-grid-item tx-grid-size txEntry">${(block2.data.txs[i].tx_size) / 1000} kB</div>`);
        }
    };
    getBlock();
}

function showTx(txInput) {
    detailsPopUpHelper();
    const getTx = async() => {
        await txData(txInput);
    };
    const txData = async txInput => {
        const url3 = baseUrl + `api/transaction/${txInput}`;
        const data3 = await fetch(url3);
        const block3 = await data3.json();
        document.getElementById("txHash").innerHTML = txInput;
        document.getElementById("txDate").innerHTML = block3.data.timestamp_utc;
        document.getElementById("txExtra").innerHTML = block3.data.extra;
        document.getElementById("txBlock").innerHTML = block3.data.block_height;
        document.getElementById("txRing").innerHTML = block3.data.mixin;
        document.getElementById("txFee").innerHTML = ((block3.data.tx_fee) / 1000000000000).toString().concat(" per kB / ") + ((block3.data.tx_size) / 1000).toString().concat(" kB");
        document.getElementById("txConf").innerHTML = block3.data.confirmations;
        for (let i = 0; i < block3.data.inputs.length; i++) {
            $(".details-grid").append(`<div class="details-grid-item details-grid-hash detailsEntry truncate">${block3.data.inputs[i].key_image}</div>`);
        }
        $(".details-grid").append(`<div class="details-grid-item details-grid-item-header detailsEntry">Stealth Address: </div>`);
        for (let i = 0; i < block3.data.outputs.length; i++) {
            $(".details-grid").append(`<div class="details-grid-item details-grid-hash detailsEntry truncate">${block3.data.outputs[i].public_key}</div>`);
        }
    };
    getTx();
}

function showTxMempool(txInput) {
    mempoolTxHelper();
    const getTx = async() => {
        await txData(txInput);
    };
    const txData = async txInput => {
        const url4 = baseUrl + `api/transaction/${txInput}`;
        const data4 = await fetch(url4);
        const block4 = await data4.json();
        document.getElementById("txHash").innerHTML = txInput;
        document.getElementById("txDate").innerHTML = block4.data.timestamp_utc;
        document.getElementById("txExtra").innerHTML = block4.data.extra;
        document.getElementById("txBlock").innerHTML = block4.data.block_height;
        document.getElementById("txRing").innerHTML = block4.data.mixin;
        document.getElementById("txFee").innerHTML = ((block4.data.tx_fee) / 1000000000000).toString().concat(" per kB / ") + ((block4.data.tx_size) / 1000).toString().concat(" kB");
        document.getElementById("txConf").innerHTML = block4.data.confirmations;
        for (let i = 0; i < block4.data.inputs.length; i++) {
            $(".details-grid").append(`<div class="details-grid-item details-grid-hash detailsEntry truncate">${block4.data.inputs[i].key_image}</div>`);
        }
        $(".details-grid").append(`<div class="details-grid-item details-grid-item-header detailsEntry">Stealth Address: </div>`);
        for (let i = 0; i < block4.data.outputs.length; i++) {
            $(".details-grid").append(`<div class="details-grid-item details-grid-hash detailsEntry truncate">${block4.data.outputs[i].public_key}</div>`);
        }
    };
    getTx();
}

function search(ele) {
    if (event.key === 'Enter') {
        var inputText = ele.value.trim();
        $.getJSON(baseUrl + `api/block/${inputText}`, function(block) {
            if (block.data.hash != undefined) {
                showBlock(`${inputText}`);
            } else {
                $.getJSON(baseUrl + `api/transaction/${inputText}`, function(block2) {
                    if (block2.data.confirmations != undefined) {
                        showTx(`${inputText}`);
                        detailsPopUp();
                        $('.mempool').removeClass('active');
                        $('.detailsBackground').removeClass('active');
                        $('.detailsBackground').addClass('inactive');
                        $('.searchContainer').addClass('active');
                    } else {
                        warning();
                    }
                });
            }
        });
    }
}

const offset = 100;
let xDown, yDown

window.addEventListener('touchstart', e => {
    const firstTouch = getTouch(e);

    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
});

window.addEventListener('touchend', e => {
    if (!xDown || !yDown) {
        return;
    }

    const {
        clientX: xUp,
        clientY: yUp
    } = getTouch(e);
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    const xDiffAbs = Math.abs(xDown - xUp);
    const yDiffAbs = Math.abs(yDown - yUp);

    if (Math.max(xDiffAbs, yDiffAbs) < offset) {
        return;
    }

    if (xDiffAbs > yDiffAbs) {
        if (xDiff > 0) {
            //console.log('left');
        } else {
            //console.log('right');
        }
    } else {
        if (yDiff > 0) {
            //console.log('up');
        } else {
            if (!onMain) {
                if (topOfPageDetails || topOfPageTx) {
                    removeAll();
                }
            }
        }
    }
});

function getTouch(e) {
    return e.changedTouches[0]
}

$('.txPopUp').on('scroll', function() {
    var scrollTop = $(this).scrollTop();

    $('#txSize').each(function() {
        var topDistance = $(this).offset().top;

        if ((topDistance) < scrollTop) {
            topOfPageTx = false;
        } else {
            topOfPageTx = true;
        }
    });
});

$('.detailsPopUp').on('scroll', function() {
    var scrollTop = $(this).scrollTop();

    $('#detailsHash').each(function() {
        var topDistance = $(this).offset().top;

        if ((topDistance - 200) < scrollTop) {
            topOfPageDetails = false;
        } else {
            topOfPageDetails = true;
        }
    });
});

function transition1() {
    $('.transition').addClass('active');
}

function transition2() {
    $('.transition').addClass('active2');
}

function removeTransition() {
    $('.transition').removeClass('active');
    $('.transition').removeClass('active2');
}

function bodyAddTransitioning() {
    $('body').addClass('transitioning');
}

function bodyRemoveTransitioning() {
    $('body').removeClass('transitioning');
}

function themeText() {
    if($('#menuEntryData4').text() == 'Light Theme 🌝') {
        $('#menuEntryData4').html("Dark Theme 🌚");
    } else {
        $('#menuEntryData4').html("Light Theme 🌝");
    }
}

function transition() {
    setTimeout(bodyAddTransitioning, 1);
    transition1();
    setTimeout(transition2, 600);
    setTimeout(themeText, 600);
    setTimeout(switchTheme, 601);
    setTimeout(removeTransition, 1200);
    setTimeout(bodyRemoveTransitioning, 1201);
}

function switchTheme() {
    if (document.documentElement.getAttribute('data-theme') == 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

function warning() {
    $('.warningPopUp').addClass('active');
    $('.warning-container-header').addClass('active');
    $('.warning-container-header-item').addClass('active');
    setTimeout(warningHelper, 1500);
}

function warningHelper() {
    console.log("test2");
    $('.warning-container-header').addClass('active2');
    $('.warningPopUp').removeClass('active');
    $('.warning-container-header').removeClass('active');
    $('.warning-container-header-item').removeClass('active');
    $('#searchBar').val('');
    $('#searchBar').focus();
    setTimeout(warningHelper2, 550);
}

function warningHelper2() {
    $('.warning-container-header').removeClass('active2');
}

function scrollProgressBlock() {
    var winScroll = document.getElementById("blockPopUp").scrollTop;
    var height = document.getElementById("blockPopUp").scrollHeight - document.getElementById("blockPopUp").clientHeight;
    var scrolled = (winScroll / height) * 100 * 1;
    document.getElementById("progressBarBlockHeader").style.width = scrolled + "%";
  }

  function scrollProgressTx() {
    var winScroll = document.getElementById("txPopUp").scrollTop;
    var height = document.getElementById("txPopUp").scrollHeight - document.getElementById("txPopUp").clientHeight;
    var scrolled = (winScroll / height) * 100 * 1;
    document.getElementById("progressBarTxHeader").style.width = scrolled + "%";
  }

  function scrollProgressMempool() {
    var winScroll = document.getElementById("mempool").scrollTop;
    var height = document.getElementById("mempool").scrollHeight - document.getElementById("mempool").clientHeight;
    var scrolled = (winScroll / height) * 100 * 1;
    document.getElementById("progressBarMempoolHeader").style.width = scrolled + "%";
  }

  function scrollProgressDetails() {
    var winScroll = document.getElementById("detailsPopUp").scrollTop;
    var height = document.getElementById("detailsPopUp").scrollHeight - document.getElementById("detailsPopUp").clientHeight;
    var scrolled = (winScroll / height) * 100 * 1;
    document.getElementById("progressBarDetailsHeader").style.width = scrolled + "%";
  }

  function expandMenu() {
    $('.menu').addClass('expanded');
  }

  function collapseMenu() {
    $('.menu').removeClass('expanded');
    $('.mempool').removeClass('active');
    $('.blockPopUp').removeClass('unfocused');
    $('.progressBarBlock').removeClass('unfocused');
    $('.progressBarMempool').removeClass('active');
    onMempool = false;
  }

  function collapseMenuLight() {
    $('.menu').removeClass('expanded');
  }


  function showMempool() {
    onMempool = true;
    $('.mempool').addClass('active');
    $('.blockPopUp').addClass('unfocused');
    $('.progressBarBlock').addClass('unfocused');
    $('.progressBarMempool').addClass('active');
  }