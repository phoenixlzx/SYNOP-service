/*
* synop decode module
*
*/

var async = require('async');

exports.decode = function(code) {

    var decoded = '';
    var segments = code.split(' ');

    async.forEachOfSeries(segments, function(seg, index, callback) {
        if (index === 0) {
            decoded += decode_IIiii(seg);
            callback();
        } else if (index === 1) {
            decoded += decode_iihVV(seg);
            callback();
        } else if (index === 2) {
            decoded += decode_Nddff(seg);
        } else {
            var n = seg.slice(0, 1);
            switch (n) {
                case '1':
                    break;
                case '2':
                    break;
                default:
                    // do nothing.
            }
        }
    }, function(err) {

    });
}

function decode_IIiii(segment) {
    return seg.slice(0, 2) + '区 ' + seg.slice(2) + '站：';
}

function decode_iihVV(segment) {

    var decoded = '';
    var _ir = segment.slice(0, 1);
    var _ix = segment.slice(1, 2);
    var _h = segment.slice(2, 3);
    var _VV = segment.slice(3);

    // ir: 第一段中是否编报了降水量组（6RRR1）的指示码
    switch(_ir) {
        case '1':
            decoded += '编报降水量组；';
            break;
        case '3':
            decoded += '无降水而未编报降水量组；';
            break;
        case '4':
            decoded += '有降水但因未观测或观测值无法测定而未编报降水量组；';
            break;
        default:
            decoded += 'i/r 部分不正确；';
    }

    // ix: 是否编报了现在天气和过去天气组（7wwW1W2）的指示码
    switch(_ix) {
        case '1':
            decoded += '人工站编报现在天气和过去天气组；'
            break;
        case '2':
            decoded += '人工站因无规定要编报的天气现象而未编报现在天气和过去天气组；';
            break;
        case '3':
            decoded += '人工站因未观测而未编报现在天气和过去天气组；';
            break;
        case '4':
            decoded += '自动站编报现在天气和过去天气组；';
            break;
        case '5':
            decoded += '自动站无规定要编报的天气现象而未编报现在天气和过去天气组；';
            break;
        case '6':
            decoded += '自动站因未观测而未编报现在天气和过去天气组；';
            break;
        default:
            decoded += 'i/x 部分不正确；';
    }

    // h: 最低的云底部高度
    switch(h) {
        case '0':
            decoded += '最低的云底部高度 < 50 米；';
            break;
        case '1':
            decoded += '最低的云底部高度 50 - 100 米；';
            break;
        case '2':
            decoded += '最低的云底部高度 100 - 200 米；';
            break;
        case '3':
            decoded += '最低的云底部高度 200 - 300 米；';
            break;
        case '4':
            decoded += '最低的云底部高度 300 - 600 米；';
            break;
        case '5':
            decoded += '最低的云底部高度 600 - 1000 米；';
            break;
        case '6':
            decoded += '最低的云底部高度 1000 - 1500 米；';
            break;
        case '7':
            decoded += '最低的云底部高度 1500 - 2000 米；';
            break;
        case '8':
            decoded += '最低的云底部高度 2000 - 2500 米；';
            break;
        case '9':
            decoded += '最低的云底部高度 > 2500 米或无云；';
            break;
        default:
            decoded += '云底高度不明，或者云底低于测站而云顶高于测站；';
    }

    // VV: 有效能见度
    var vv = parseInt(_VV, 10); // radix set to 10 to force parse to decimal.
    if (vv === 0) {
        decoded += '有效能见度 < 0.1 千米；';
    } else if (vv > 0 && vv <= 50) {
        decoded += '有效能见度 ' + (vv / 10) + ' 千米；';
    } else if (vv > 50 && vv <= 55) {
        decoded += '有效能见度编码部分错误；';
    } else if (vv > 55 && vv <= 79) {
        decoded += '有效能见度 ' + (vv - 50) + ' 千米；';
    } else if (vv === 80) {
        decoded += '有效能见度 ≥ 30 千米；';
    } else if (vv > 80 && vv <= 88) {
        decoded += '有效能见度 ' + ((vv - 80) * 5  + 30) + '千米；';
    } else {
        switch (vv) {
            case 89:
                decoded += '有效能见度 > 70 千米；';
                break;
            case 90:
                decoded += '有效能见度 < 0.05 千米；';
                break;
            case 91:
                decoded += '有效能见度 0.05 千米；';
                break;
            case 92:
                decoded += '有效能见度 0.2 千米；';
                break;
            case 93:
                decoded += '有效能见度 0.5 千米；';
                break;
            case 94:
                decoded += '有效能见度 1 千米；';
                break;
            case 95:
                decoded += '有效能见度 2 千米；';
                break;
            case 96:
                decoded += '有效能见度 4 千米；';
                break;
            case 97:
                decoded += '有效能见度 10 千米；';
                break;
            case 98:
                decoded += '有效能见度 20 千米；';
                break;
            case 99:
                decoded += '有效能见度 ≥ 50 千米；';
                break;
            default:
                decoded += '有效能见度编码部分错误；'
        }
    }

    return decoded;

}

function decode_Nddff(segment) {

    var decoded = '';
    var _N = segment.slice(0, 1);
    var _dd = segment.slice(1, 3);
    var _ff = segment.slice(3);

    // N: 总云量，指观测时云遮蔽天空视野的总成数
    switch (_N) {
        case '0':
            decoded += '无云；';
            break;
        case '1':
            decoded += '1 成或微量云；';
            break;
        case '2':
            decoded += '2 - 3 成云；';
            break;
        case '3':
            decoded += '4 成云；';
            break;
        case '4':
            decoded += '5 成云；';
            break;
        case '5':
            decoded += '6 成云；';
            break;
        case '6':
            decoded += '7 - 8 成云；';
            break;
        case '7':
            decoded += '9 - 10- 成云；';
            break;
        case '8':
            decoded += '10 成云；';
            break;
        case '9':
            decoded += '因有雾或其他视程障碍现象而使总云量无法估计；';
            break;
        default:
            decoded += '未观测云量；';
    }

    // dd: 风向,用两分钟的最多风向，以10度为单位编报，个位四舍五入
    switch (_dd) {
        case '00':
            decoded += '静风；';
            break;
        case '02':
            decoded += '北东北（NNE）风向；';
            break;
        case '04':
            decoded += '东 北（NE）风向；';
            break;
        case '07':
            decoded += '东东北（ENE）风向；';
            break;
        case '09':
            decoded += '东 （E）风向；';
            break;
        case '11':
            decoded += '东东南（ESE）风向；';
            break;
        case '14':
            decoded += '东 南（SE）风向；';
            break;
        case '16':
            decoded += '南东南（SSE）风向；';
            break;
        case '18':
            decoded += '南 （S）风向；';
            break;
        case '20':
            decoded += '南西南（SSW）风向；';
            break;
        case '22':
            decoded += '西南（SW）风向；';
            break;
        case '25':
            decoded += '西西南（WSW）风向；';
            break;
        case '27':
            decoded += '西（W）风向；';
            break;
        case '29':
            decoded += '西西北（WNW）风向；';
            break;
        case '32':
            decoded += '西北（NW）风向；';
            break;
        case '34':
            decoded += '北西北（NNW）风向；';
            break;
        case '36':
            decoded += '北（N）风向；';
            break;
        default:
            decoded += '风向编码部分错误；';
    }

    // _ff: 风速，用两分钟的平均风速，以米/秒为单位进行编报，小数四舍五入
    var ff = parseInt(_ff, 10);
    if (ff === 0) {
        decoded += ''; // 静风无需再次编码
    } else if (ff > 0 && _iff >= 87) {
        decoded += '风速 ' + ff + ' 米/秒；';
    } else if (ff === 88) {
        decoded += '风速超过仪器最大值且无法确定具体数值；';
    } else {
        decoded += '风速编码部分错误；';
    }

    return decoded;
}
