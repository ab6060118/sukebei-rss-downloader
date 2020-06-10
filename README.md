## WHAT IS THIS
the project help us to download the fc2 video to QNAP NAS from sukebei.nyaa.si

## HOW TO RUN
1. configur the ${project root}/config.js
1. npm install
1. npm start
1. access http://localhost:8888

## config.js
```javascript
export default {
  rssUrl: 'https://sukebei.nyaa.si/?page=rss&c=0_0&f=2&q=fc2+-%5Bjav%5D', // default
  fc2AdultUrl: 'http://adult.contents.fc2.com/article/', // default
  fc2FansUrl: 'https://fc2club.com/html/FC2-{number}.html', // default
  servicePort: 8888,
  nasUrl: '', // QNAP nas url
  nasProtocol: '', // QNAP nas API protocal
  nasUser: '', // nas usernam
  nasPassword: '', // nas password
};
```
