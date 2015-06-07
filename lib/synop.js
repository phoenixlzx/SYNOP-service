/*
* synop decode module
*
*/

var async = require('async');

exports.decode = function(code, cb) {

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
                    decoded += decode_1sTTT(seg);
                    callback();
                    break;
                case '2':
                    decoded += decode_2sTTT(seg);
                    callback();
                    break;
                case '3':
                    decoded += decode_3PPPP(seg);
                    callback();
                    break;
                case '4':
                    decoded += decode_4PPPP(seg);
                    callback();
                    break;
                case '5':
                    decoded += decode_5appp(seg);
                    callback();
                    break;
                case '6':
                    decoded += decode_6RRR1(seg);
                    callback();
                    break;
                case '7':
                    decoded += decode_7wwWW(seg);
                    callback();
                    break;
                case '8':
                    decoded += decode_8NCCC(seg);
                    callback();
                    break;
                case '9':
                    decoded += decode_9GGgg(seg);
                    callback();
                    break;
                default:
                    // do nothing.
                    callback();
            }
        }
    }, function(err) {
        if (err) {
            cb(err);
        }
        cb();
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

function decode_1sTTT(segment) {
    return '气温 ' + (parseInt(segment.slice(1, 2), 10) === 1 ? '':'零下') + (parseInt(segment.slice(2), 10) / 10) + ' 摄氏度；';
}

function decode_2sTTT(segment) {
    if (segment.slice(0, 2) === '29') {
        // 使用 29UUU 型编报
        return '相对湿度 ' + (parseInt(segment.slice(2), 10)) + '%；';
    }

    var temp = parseInt(segment.slice(2), 10) / 10;
    var sym = parseInt(segment.slice(1, 2), 10) === 1 ? '':'零下 ';

    if (temp > 80 && segment.slice(1, 2) === '1') {
        return '露点温度 低于 零下 80.0 摄氏度；';
    } else {
        return '露点温度 ' + sym + temp + ' 摄氏度；';
    }
}

function decode_3PPPP(segment) {
    return '气压 ' + (parseInt(segment.slice(1), 10) / 10) + ' 百帕；';
}

function decode_4PPPP(segment) {
    return '海平面气压 1' + (parseInt(segment.slice(1), 10) / 10) + ' 百帕；';
}

function decode_5appp(segment) {

    var a = parseInt(segment.slice(1, 2), 10);
    var val = parseInt(segment.slice(2), 10);
    var sym = '';

    switch (a) {
        case 2:
            sym = '气压上升 ';
            break;
        case 4:
            sym = '气压持平 ';
            break;
        case 7:
            sym = '气压下降 ';
            break;
        default:
            sym = '气压变化趋势编码错误 ';
    }

    return sym + val + ' 百帕；';

}

function decode_6RRR1(segment) {

    var rrr = parseInt(segment.slice(1, 4), 10);

    if (rrr === 0) {
        return '降水量编码部分错误；';
    } else if (rrr > 0 && rrr < 990) {
        return '过去六小时内降水量为 ' + rrr + ' 毫米；';
    } else if (rrr === 990) {
        return '过去六小时内有微量降水；';
    } else if (rrr > 990 && rrr <= 999) {
        return '过去六小时内降水量为 ' + ((rrr - 990) / 10) + ' 毫米；';
    }

}

function decode_7wwWW(segment) {

    var _ww = segment.slice(1, 3);
    var _WW = segment.slice(3);

    // TODO decode _WW in the right way. (blame document)

    // ww: 现在天气现象
    var weather_table = {
        '00': '没有出现规定要编报ww的各种天气现象；',
        '01': '天气现象部分编报错误；',
        '02': '天气现象部分编报错误；',
        '03': '天气现象部分编报错误；',
        '04': '水平能见度因烟（草原或森林着火而引起的烟，工厂排出的烟）或火山爆发的灰尘障碍而降低；',
        '05': '有霾；',
        '06': '有浮尘；',
        '07': '由测站或测站附近的风吹起来的扬沙或尘土，但还没有发展成完好的尘卷风或沙尘暴；或飞沫吹到观测船上；',
        '08': '一小时内在测站或测站附近看到发展完好的尘卷风，但没有沙尘暴；',
        '09': '视区内有沙尘暴，或者观测前一小时内测站有沙尘暴；',
        '10': '有轻雾；',
        '11': '有浅雾，呈片状，在陆地上厚度不超过2米，在海上不超过10米；',
        '12': '有浅雾，基本连续，在陆地上厚度不超过2米，在海上不超过10米；',
        '13': '有闪电；',
        '14': '有降水，没有到达地面或海面；',
        '15': '有降水，已经到达地面或海面，但估计距测站5千米以外；',
        '16': '有降水，已经到达地面或海面，在测站附近，但本站无降水；',
        '17': '有雷暴，但观测时测站没有降水；',
        '18': '有飑，观测时或观测前一小时内在测站或视区内出现；',
        '19': '有龙卷，观测时或观测前一小时内在测站或视区内出现；',
        '20': '有非阵性的毛毛雨；',
        '21': '有雨；',
        '22': '有雪、米雪或冰粒；',
        '23': '有雨夹雪，或雨夹冰粒；',
        '24': '有毛毛雨或雨，并有雨凇结成；',
        '25': '有阵雨；',
        '26': '有阵雪，或阵性雨夹雪；',
        '27': '有冰雹或霰（伴有或不伴有雨）；',
        '28': '有雾；',
        '29': '有雷暴（伴有或不伴有降水）',
        '30': '有轻的或中度的沙尘暴，过去一小时内减弱；',
        '31': '有轻的或中度的沙尘暴，过去一小时内没有显著的变化；',
        '32': '有轻的或中度的沙尘暴，过去一小时内开始或增强；',
        '33': '有强的沙尘暴，过去一小时内减弱；',
        '34': '有强的沙尘暴，过去一小时内没有显著的变化；',
        '35': '有强的沙尘暴，过去一小时内开始或增强；',
        '36': '有轻的或中度的低吹雪，吹雪所达高度一般低于水平视线；',
        '37': '有强的低吹雪，吹雪所达高度一般低于；',
        '38': '有轻的或中度的高吹雪，吹雪所达高度一般高于水平视线；',
        '39': '有强的高吹雪，吹雪所达高度一般高于水平视线；',
        '40': '观测时近处有雾，其高度高于观测员的眼睛（水平视线），但观测前一小时内测站没有雾；',
        '41': '有散片的雾；',
        '42': '有雾，过去一小时内已变薄，天空可辨明；',
        '43': '有雾，过去一小时内已变薄，天空不可辨；',
        '44': '有雾，过去一小时内强度没有显著的变化，天空可辨明；',
        '45': '有雾，过去一小时内强度没有显著的变化，天空不可辨；',
        '46': '有雾，过去一小时内开始出现或已变浓，天空可辨明；',
        '47': '有雾，过去一小时内开始出现或已变浓，天空不可辨；',
        '48': '有雾，有雾凇结成，天空可辨明；',
        '49': '有雾，有雾凇结成，天空不可辨；',
        '50': '有间歇性轻毛毛雨；',
        '51': '有连续性轻毛毛雨；',
        '52': '有间歇性中常毛毛雨；',
        '53': '有连续性中常毛毛雨；',
        '54': '有间歇性浓毛毛雨；',
        '55': '有连续性浓毛毛雨；',
        '56': '有轻的毛毛雨，并有雨凇结成；',
        '57': '有中常的或浓的毛毛雨，并有雨凇结成；',
        '58': '有轻的毛毛雨夹雨；',
        '59': '有中常的或浓的毛毛雨夹雨；',
        '60': '有间歇性小雨；',
        '61': '有连续性小雨；',
        '62': '有间歇性中雨；',
        '63': '有连续性中雨；',
        '64': '有间歇性大雨；',
        '65': '有连续性大雨；',
        '66': '有小雨，并有雨凇结成；',
        '67': '有中雨或大雨，并有雨凇结成；',
        '68': '有小的雨夹雪，或轻毛毛雨夹雪；',
        '69': '有中常的或大的雨夹雪，或中常的或浓的毛毛雨夹雪；',
        '70': '有间歇性小雪；',
        '71': '有连续性小雪；',
        '72': '有间歇性中雪；',
        '73': '有连续性中雪；',
        '74': '有间歇性大雪；',
        '75': '有连续性大雪；',
        '76': '有冰针（伴有或不伴有雾）；',
        '77': '有米雪（伴有或不伴有雾）；',
        '78': '有孤立的星状雪晶（伴有或不伴有雾）；',
        '79': '有冰粒；',
        '80': '有小的阵雨；',
        '81': '有中常的阵雨；',
        '82': '有大的阵雨；',
        '83': '有小的阵性雨夹雪；',
        '84': '有中常或大的阵性雨夹雪；',
        '85': '有小的阵雪；',
        '86': '有中常或大的阵雪；',
        '87': '有小的阵性霰，伴有或不伴有雨或雨夹雪；',
        '88': '有中常或大的阵性霰，伴有或不伴有雨或雨夹雪；',
        '89': '有轻的冰雹，伴有或不伴有雨或雨夹雪；',
        '90': '有中常或强的冰雹，伴有或不伴有雨或雨夹雪；',
        '91': '观测前一小时内有雷暴，观测时有小雨；',
        '92': '观测前一小时内有雷暴，观测时有中雨或大雨；',
        '93': '观测前一小时内有雷暴，观测时有小（轻）的雪、或雨夹雪、或霰、或冰雹；',
        '94': '观测前一小时内有雷暴，观测时有中常或大（强）的雪、或雨夹雪、或霰、或冰雹；',
        '95': '有小或中常的雷暴，观测时没有冰雹、或霰，但有雨、或雪、或雨夹雪；',
        '96': '有小或中常的雷暴，观测时伴有冰雹、或霰；',
        '97': '有大雷暴，观测时没有冰雹、或霰，但有雨、或雪、或雨夹雪',
        '98': '有雷暴，观测时伴有沙尘暴和降水；',
        '99': '有大雷暴，观测时伴有冰雹、或霰；',
    };

    return weather_table[_ww];

}

function decode_8NCCC(segment) {

    var _Nh = segment.slice(1, 2);
    var _Cl = segment.slice(2, 3);
    var _Cm = segment.slice(3, 4);
    var _Ch = segment.slice(4);
    var n = '';
    var decoded = '';

    switch (_Nh) {
        case '0':
            n = '无云；';
            break;
        case '1':
            n = '1 成或微量云；';
            break;
        case '2':
            n = '2 - 3 成云；';
            break;
        case '3':
            n = '4 成云；';
            break;
        case '4':
            n = '5 成云；';
            break;
        case '5':
            n = '6 成云；';
            break;
        case '6':
            n = '7 - 8 成云；';
            break;
        case '7':
            n = '9 - 10- 成云；';
            break;
        case '8':
            n = '10 成云；';
            break;
        case '9':
            n = '因有雾或其他视程障碍现象而使总云量无法估计；';
            break;
        default:
            n = '未观测云量；';
    }

    if (_Cl === '0') {
        decoded += '中层' + n;
    } else {
        decoded += '低层' + n;
    }

    switch (_Cl) {
        case '0':
            decoded += '没有CL云；';
            break;
        case '1':
            decoded += '有淡积云或碎积云，或两者同时存在；';
            break;
        case '2':
            decoded += '有浓积云，可伴有淡积云、碎积云或层积云，云底在同一高度上；';
            break;
        case '3':
            decoded += '有秃积雨云，可伴有积云或层积云或层云；';
            break;
        case '4':
            decoded += '有积云性层积云；';
            break;
        case '5':
            decoded += '有层积云，不是积云性的；';
            break;
        case '6':
            decoded += '有层云和（或）碎层云，但不是恶劣天气的碎雨云；';
            break;
        case '7':
            decoded += '有恶劣天气下的碎雨云，通常在高层云或雨层云之下；';
            break;
        case '8':
            decoded += '有积云和不是积云性的层积云同时存在，此两种云的底部高度不同；';
            break;
        case '9':
            decoded += '有鬃积雨云，常带砧状，可伴有积云、层积云、层云或恶劣天气下的碎云；';
            break;
        default:
            decoded += '由于黑暗、或雾、或沙尘暴、或其他类似现象以致看不到属于CL的各属云；';
    }

    switch (_Cm) {
        case '0':
            decoded += '没有CM云；';
            break;
        case '1':
            decoded += '有透光高层云；';
            break;
        case '2':
            decoded += '有蔽光高层云或雨层云；';
            break;
        case '3':
            decoded += '有透光高积云，较稳定，并且在同一个高度上；';
            break;
        case '4':
            decoded += '有透光高积云（常呈荚状）或荚状层积云，连续不断地在改变中，并且出现在一个或几个高度上；';
            break;
        case '5':
            decoded += '有成带的或成层的透光高积云，有系统地侵入天空，常常全部增厚，甚至有一部分已变成蔽光高积云或复高积云；';
            break;
        case '6':
            decoded += '有积云性高积云；';
            break;
        case '7':
            decoded += '有复高积云或蔽光高积云，不是有系统地侵盖天空；或者高层云和高积云同时存在；';
            break;
        case '8':
            decoded += '有积云状高积云（絮状的或堡状的）或堡状层积云；';
            break;
        case '9':
            decoded += '有混乱天空的高积云，常出现在几个高度上；';
            break;
        default:
            decoded += '由于黑暗、或雾、或沙尘暴、或其他类似现象，或者完整的较低云层存在，以致看不到属于CM的各属云；';
    }

    switch (_Ch) {
        case '0':
            decoded += '没有CH云；';
            break;
        case '1':
            decoded += '有毛卷云，分散在天空，不是有系统地侵盖天空；';
            break;
        case '2':
            decoded += '有密卷云，成散片或卷曲束状，通常量不增加，有时好象是积雨云顶部的残余部分；';
            break;
        case '3':
            decoded += '有伪卷云，或为过去的积雨云的残余部分，或为远处母体看不到的积雨云的顶部；';
            break;
        case '4':
            decoded += '有卷云（常常是钩卷云）有系统地侵盖天空，并且常常全部增厚；';
            break;
        case '5':
            decoded += '有辐辏状卷云和卷层云，或只有卷层云，有系统地侵盖天空，且常全部增厚，但卷层云幕前缘的高度角不到45°；';
            break;
        case '6':
            decoded += '有辐辏状卷云和卷层云，或只有卷层云，有系统地侵盖天空，且常全部增厚，同时卷层云幕前缘的高度角已超过45°，但未布满全天；';
            break;
        case '7':
            decoded += '有卷层云布满全天；';
            break;
        case '8':
            decoded += '有卷层云，不是有系统地侵盖天空，也没有布满全天；';
            break;
        case '9':
            decoded += '有卷积云；';
            break;
        default:
            decoded += '由于黑暗、或雾、或沙尘暴、或其他类似现象，或者完整的较低云层存在，以致看不到属于CH的各属云；';
    }

    return decoded;

}

function decode_9GGgg(segment) {

    var hh = parseInt(segment.slice(1, 3), 10);
    var mm = parseInt(segment.slice(4), 10);

    return '报告时间：' + hh + '时' + mm + '分。'

}
