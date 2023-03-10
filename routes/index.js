const express = require('express');
const router = express.Router();
const axios = require('axios');
const chainConfig = {maxRedirects: 50};
const redirectionChain = require('redirect-chain')(chainConfig);

// URL 추출 정규표현식
const urlPattern = /(https?):\/\/([^ ]*)/;

// a tag 추출 정규표현식
const linkPattern = /(a href=)"?([^<>\s'"]*)('|"|\s|)/;

// isSpam function
const isSpam = async (content, spamLinkDomains, redirectionDepth) => {
    // 도메인 추출
    const url = content.match(urlPattern)[0];
    
    let finalDomain = '';
    let redirectionCount = 0;
    let data = '';
    await axios({
        method : 'get',
        url    : url,
        timeout: 10 * 60 * 1000,
    }).then((response) => {
        // console.log(response);
        finalDomain = response.request.res.responseUrl;
        redirectionCount = response.request._redirectable._redirectCount;
        data = response.data;
    }).catch((error) => {
        console.log(error);
    });
    
    // 최종 URL에서 도메인 분리
    let finalHostname = new URL(finalDomain).hostname;
    
    // 리다이렉션 도메인 확인
    const domainChains = await redirectionChain.domains(url);
    for (let key in domainChains) {
        for (let domain of spamLinkDomains) {
            if (domainChains[key] === domain && (Number(key) + 1) === redirectionDepth) {
                return true;
            }
        }
    }
    
    // a tag내 링크 추출
    let hyperlink = '';
    if (data) {
        hyperlink = data.match(linkPattern)[2];
    }
    
    // 도메인별 검사
    let checkDomain = false;
    for (let domain of spamLinkDomains) {
        if (hyperlink === domain && redirectionCount === redirectionDepth) {
            checkDomain = true;
        }
    }
    
    return checkDomain;
}

/* Spam Filter Test */
router.get('/', async (req, res, next) => {
    const isSpamAnswer = await isSpam('spam spam http://localhost:3000/spam1', ['localhost:3000', 'www.naver.com'], 1);
    
    res.render('index', {answer: isSpamAnswer});
});

// Redirect #1
router.get('/spam1', (req, res) => {
    res.redirect(301, '/spam2');
});

// Redirect #2
router.get('/spam2', (req, res) => {
    res.redirect(302, '/spam3');
});

// Redirect #3
router.get('/spam3', (req, res) => {
    res.render('spamTest', {title: 'Spam'});
});

module.exports = router;
