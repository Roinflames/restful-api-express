import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios'
import cheerio from 'cheerio'

class AccuController {

  getInfo(req, res){
    setInterval(() => {
    	axios.get('http://www.accuweather.com/es/cl/santiago/60449/weather-forecast/60449')
    	.then( res => {
    		const $ = cheerio.load(res.data)
    		const table = $('BODY CENTER TABLE[cellspacing=0]').toArray()
    		//const data = table[0].children[2].children[4].children[0].children[0].data
        //const data = table[0].children[0].data
    		console.log(res.data)
    	})
    	.catch ( err => {
    		console.log(err)
    	})
    }, 2000)
  }

}
export default AccuController
