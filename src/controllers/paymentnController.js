import moment from 'moment';
import qs from 'qs';
import crypto from 'crypto';

// --- CẤU HÌNH ---
const tmnCode = process.env.VNP_TMN_CODE;
const secretKey = process.env.VNP_HASH_SECRET;
const vnpUrl = process.env.VNP_URL;
const returnUrl = process.env.VNP_RETURN_URL;

// --- HÀM PHỤ TRỢ (Sort Object) ---
const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
};

// ============================================
// 1. TẠO URL THANH TOÁN
// ============================================
export const createPaymentUrl = (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let locale = req.body.language || 'vn';
    let orderId = moment(date).format('DDHHmmss');

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    
    vnp_Params['vnp_SecureHash'] = signed;
    
    let paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

    res.status(200).json({ url: paymentUrl });
};

// ============================================
// 2. XỬ LÝ RETURN URL
// ============================================
export const vnpayReturn = (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

    const frontendUrl = 'http://localhost:5173';

    if (secureHash === signed) {
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            return res.redirect(`${frontendUrl}/chonve?status=success&orderId=${vnp_Params['vnp_TxnRef']}&code=00`);
        } else {
            return res.redirect(`${frontendUrl}/chonve?status=failed&code=${vnp_Params['vnp_ResponseCode']}`);
        }
    } else {
        return res.redirect(`${frontendUrl}/payticket`);
    }
};

// ============================================
// 3. XỬ LÝ IPN
// ============================================
export const vnpayIpn = (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        // Code xử lý DB check đơn hàng ở đây...
        // Giả lập check thành công
        if (rspCode == "00") {
            console.log("IPN Success:", orderId);
            res.status(200).json({ RspCode: '00', Message: 'Success' });
        } else {
            console.log("IPN Fail:", orderId);
            res.status(200).json({ RspCode: '00', Message: 'Success' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
};