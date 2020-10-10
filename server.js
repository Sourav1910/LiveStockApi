const express = require('express')
const app = express()
const request = require('request-promise')
const cheerio = require('cheerio')
const port = process.env.port || 3000;
var obj;
app.get('/', function (req, res) {
    let company_code = req.query.companycCode;
    const info = "https://in.finance.yahoo.com/quote/"+company_code+"?p="+company_code+"&.tsrc=fin-srch";

    
    (async() => {
        const response = await  request({
            uri : info,
            headers:{
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept":"Encoding: gzip, deflate, br", 
                "Accept":"Language: en-US,en;q=0.9"
            },
            gzip: true
        })
    
        let $ = cheerio.load(response)
       
        let currPrice = $("#quote-header-info > div.My\\(6px\\).Pos\\(r\\).smartphone_Mt\\(6px\\) > div.D\\(ib\\).Va\\(m\\).Maw\\(65\\%\\).Ov\\(h\\) > div > span.Trsdu\\(0\\.3s\\).Fw\\(b\\).Fz\\(36px\\).Mb\\(-4px\\).D\\(ib\\)").text().trim()
        let incdec = $("#quote-header-info > div.My\\(6px\\).Pos\\(r\\).smartphone_Mt\\(6px\\) > div.D\\(ib\\).Va\\(m\\).Maw\\(65\\%\\).Ov\\(h\\) > div > span.Trsdu\\(0\\.3s\\).Fw\\(500\\).Pstart\\(10px\\).Fz\\(24px\\).C\\(\\$positiveColor\\)").text().trim()
        if(incdec == ''){
            incdec = $("#quote-header-info > div.My\\(6px\\).Pos\\(r\\).smartphone_Mt\\(6px\\) > div.D\\(ib\\).Va\\(m\\).Maw\\(65\\%\\).Ov\\(h\\) > div > span.Trsdu\\(0\\.3s\\).Fw\\(500\\).Pstart\\(10px\\).Fz\\(24px\\).C\\(\\$negativeColor\\)").text().trim()
        }
        
        let previous_close = $("#quote-summary > div.D\\(ib\\).W\\(1\\/2\\).Bxz\\(bb\\).Pend\\(12px\\).Va\\(t\\).ie-7_D\\(i\\).smartphone_D\\(b\\).smartphone_W\\(100\\%\\).smartphone_Pend\\(0px\\).smartphone_BdY.smartphone_Bdc\\(\\$seperatorColor\\) > table > tbody > tr:nth-child(1) > td.Ta\\(end\\).Fw\\(600\\).Lh\\(14px\\) > span").text().trim()
        let open = $("#quote-summary > div.D\\(ib\\).W\\(1\\/2\\).Bxz\\(bb\\).Pend\\(12px\\).Va\\(t\\).ie-7_D\\(i\\).smartphone_D\\(b\\).smartphone_W\\(100\\%\\).smartphone_Pend\\(0px\\).smartphone_BdY.smartphone_Bdc\\(\\$seperatorColor\\) > table > tbody > tr:nth-child(2) > td.Ta\\(end\\).Fw\\(600\\).Lh\\(14px\\) > span").text().trim()
        let volume = $("#quote-summary > div.D\\(ib\\).W\\(1\\/2\\).Bxz\\(bb\\).Pend\\(12px\\).Va\\(t\\).ie-7_D\\(i\\).smartphone_D\\(b\\).smartphone_W\\(100\\%\\).smartphone_Pend\\(0px\\).smartphone_BdY.smartphone_Bdc\\(\\$seperatorColor\\) > table > tbody > tr:nth-child(7) > td.Ta\\(end\\).Fw\\(600\\).Lh\\(14px\\) > span").text().trim()
        let market_cap = $("#quote-summary > div.D\\(ib\\).W\\(1\\/2\\).Bxz\\(bb\\).Pstart\\(12px\\).Va\\(t\\).ie-7_D\\(i\\).ie-7_Pos\\(a\\).smartphone_D\\(b\\).smartphone_W\\(100\\%\\).smartphone_Pstart\\(0px\\).smartphone_BdB.smartphone_Bdc\\(\\$seperatorColor\\) > table > tbody > tr:nth-child(1) > td.Ta\\(end\\).Fw\\(600\\).Lh\\(14px\\) > span").text().trim()
        let company = $("#quote-header-info > div.Mt\\(15px\\) > div.D\\(ib\\).Mt\\(-5px\\).Mend\\(20px\\).Maw\\(56\\%\\)--tab768.Maw\\(52\\%\\).Ov\\(h\\).smartphone_Maw\\(85\\%\\).smartphone_Mend\\(0px\\) > div.D\\(ib\\) > h1").text().trim()
        let stock_exchange = $("#quote-header-info > div.Mt\\(15px\\) > div.D\\(ib\\).Mt\\(-5px\\).Mend\\(20px\\).Maw\\(56\\%\\)--tab768.Maw\\(52\\%\\).Ov\\(h\\).smartphone_Maw\\(85\\%\\).smartphone_Mend\\(0px\\) > div.C\\(\\$tertiaryColor\\).Fz\\(12px\\) > span").text().trim()
        
        
        obj = {
            "Company":company,
            "Stock_Exchange": stock_exchange,
            "CurrentPrice": parseFloat(currPrice),
            "Increment_Decrement":incdec,
            "Previous_Close":parseFloat(previous_close),
            "Open": parseFloat(open),
            "Volume":parseInt(volume),
            "Market_Capital": market_cap
        }
        console.log(obj)
        res.json(obj)
    })()


    
})

app.listen(port,()=>{
    console.log("started server")
})


