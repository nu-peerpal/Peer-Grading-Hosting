import React from 'react';
//this is to make sure the API works in both production and dev-- defined in config.js
import { server } from "../config/index";
// a good tutorial for setting props with API calls: https://stackoverflow.com/questions/44342226/next-js-error-only-absolute-urls-are-supported

const Test = () => (
  <dev>
    <h1>hello</h1>
  </dev>
);
//async function is necessary to wait for the api call to be done
async function testAPI() {
  const res = await fetch(`${server}/api/announcements?courseId=1`);
  // res.json() is the data result in json format, here is where you could set props
  const data = await res.json();
  console.log(data);
}
//testAPI();

export default Test;
