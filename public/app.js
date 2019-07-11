const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * API
 */
app.get("/api", function(req, res) {
  console.log("GET request");
  console.log(req.query);
  let response = { message: "unknown get request" };
  let query = req.query;
  if (query.n && query.nn) {
    // get the state of router with name n from network with name nn
    response = { state: 1 };
  }
  res.status(200).send(response);
});

// handle a POST.
app.post("/api", function(req, res) {
  console.log("POST request");
  let response = { message: "unable to parse request" };
  // figure out what to do based on what is in data

  // get the info that was passed in
  let { what, network, clusterName } = req.body;
  // network is an object that has a nodes array, a links array, and a network name
  // clusterName is the node.Name of the cluster we are requesting data for
  if (what && what === "deployment") {
    console.log("request was for cluster deployment info");
    let cluster = network.nodes.find(n => n.Name === clusterName);
    // cluster is the object that contains the info entered about a cluster
    // cluster should contain Name, Namespace, Route-suffix, Cluster type, State

    // do some validation and construct the response
    if (cluster.Name && cluster.Name !== "") {
      // This is NOT really what we want to return. This is just an example.
      response = {
        apiVersion: "interconnectedcloud.github.io/v1alpha1",
        kind: "Interconnect",
        metadata: {
          name: "example-interconnect"
        },
        spec: {
          deploymentPlan: {
            image: "quay.io/interconnectedcloud/qdrouterd:1.7.0",
            role: "interior",
            size: 3,
            placement: "Any"
          }
        }
      };
      if (cluster["Route-suffix"] && cluster["Route-suffix"] !== "") {
        response.metadata["Route-suffix"] = cluster["Route-suffix"];
      }
      if (cluster.Namespace && cluster.Namespace !== "") {
        response.metadata.Namespace = cluster.Namespace;
      }
    }
  }
  res.status(200).send(response);
});

/**
 * STATIC FILES
 */
app.use("/", express.static("./"));

// Default every route except the above to serve the index.html
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

module.exports = app;
