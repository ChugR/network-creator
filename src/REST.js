/*
 * Copyright 2019 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* The web front-end will use this class to talk to the backend (/public/app.js)
 */
class REST {
  constructor() {
    this.url = `${window.location.protocol}//${window.location.host}`;
  }

  getDeploymentYaml = (networkInfo, clusterName) =>
    new Promise((resolve, reject) => {
      fetch(`${this.url}/api`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          what: "deployment",
          network: networkInfo,
          clusterName: clusterName
        })
      })
        .then(response => {
          if (response.status < 200 || response.status > 299) {
            reject(response.statusText);
            return {};
          }
          return response.json();
        })
        .then(myJson => {
          resolve(myJson);
        })
        // network error?
        .catch(error => reject(error));
    });

  // example of how to periodically do a GET request
  examplePoll = () =>
    new Promise((resolve, reject) => {
      // strategy defines how we want to handle various return codes
      // 200 means OK, in this example we want to resolve
      // 404 means NOT_FOUND, in this example we want to resolve so caller knows it wasn't found
      // 500 means there was a communication error, in this example we want to reject
      const strategy = { "200": "resolve", "404": "resolve", "500": "reject" };
      poll(`${this.url}/api`, strategy).then(
        res => {
          resolve(res);
        },
        e => {
          reject(e);
        }
      );
    });

  exampleDelete = name =>
    new Promise((resolve, reject) => {
      // console.log(` *** deleting ${name} ***`);
      fetch(`${this.url}/api/${name}`, {
        method: "DELETE"
      }).then(() => {
        const strategy = { "200": "wait", "404": "resolve", "500": "reject" };
        poll(`${this.url}/topics/${name}`, strategy).then(
          res => {
            resolve(res);
          },
          e => {
            reject(e);
          }
        );
      });
    });

  exampleBatch(names) {
    return new Promise((resolve, reject) => {
      Promise.all(names.map(name => this.exampleDelete(name))).then(
        () => {
          resolve();
        },
        firstError => {
          reject(firstError);
        }
      );
    });
  }
}

// poll for a condition
const poll = (url, strategy, timeout, interval) => {
  const endTime = Number(new Date()) + (timeout || 10000);
  interval = interval || 1000;
  const s200 = strategy["200"];
  const s404 = strategy["404"];
  const s500 = strategy["500"];
  let lastStatus = 0;

  const checkCondition = (resolve, reject) => {
    // If the condition is met, we're done!
    fetch(url)
      .then(res => {
        lastStatus = res.status;
        const ret = {};
        // decide whether to resolve, reject, or wait
        if (res.status >= 200 && res.status <= 299) {
          ret[s200] = res.json();
          return ret;
        } else if (res.status === 404) {
          ret[s404] = [];
          return ret;
        }
        ret[s500] = res.status;
        return ret;
      })
      .then(json => {
        if (json.resolve) {
          resolve(json.resolve);
        } else if (json.reject) {
          reject(json.reject);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
          setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
          const msg = { message: "timeout", status: lastStatus };
          reject(new Error(JSON.stringify(msg)));
        }
      })
      .catch(e => {
        console.log(`poll caught error ${e}`);
        reject(e);
      });
  };
  return new Promise(checkCondition);
};

export default REST;
