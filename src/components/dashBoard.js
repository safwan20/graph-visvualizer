import * as d3 from "d3";
import ReactDOM from 'react-dom';
import React, { Component } from 'react';

class DashBoard extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      nodes : '',
      edges : '',
      dfs_sequence : 'Sequence'
    }
  }

  componentDidMount() {
      this.nodes = [];
      this.links = [];
      this.node_dict = {}
      this.nodeslist = [];
      this.Graph = {}
      this.visited = [0];
      this.dfslist = [];
      this.mouse = null;

      let height = 800;
      let width = 1000;

      const svg = d3.select("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [-width / 3, -height / 2, width, height])
                    .on("mousemove", this.mousemoved.bind(this))

                    this.node = svg.selectAll("circle");

                    this.text = svg.selectAll("text");
              
                    this.link = svg.selectAll("line");

      this.simulation = d3.forceSimulation(this.nodes)
          .force("charge", d3.forceManyBody().strength(-700))
          .force("link", d3.forceLink(this.links))
          .force("x", d3.forceX())
          .force("y", d3.forceY())
          .on("tick", this.ticked.bind(this));
  }
    
  ticked() {
      this.node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    
      this.text.attr("x", d => d.x - 7)
          .attr("y", d => d.y + 3)
    
      this.link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  mousemoved(event) {
      const [x, y] = d3.pointer(event);
      this.mouse = {x, y};
      this.simulation.alpha(0.3).restart();
  }

  dfsTraversal(x) {
    this.visited[x] = 1;
    this.dfslist.push(x);
    
    this.Graph[x].forEach(function(num){
      if(!this.visited[num]) {
        this.dfsTraversal(num);
      }
    }.bind(this));

    this.setState({
      dfs_sequence : ''
    })
    
    this.dfslist.forEach(function(num){
      this.setState(prevState => ({
        dfs_sequence : prevState.dfs_sequence +  num.toString() + " "
      }))
    }.bind(this));  
  }

  DFS() {
    if(this.nodeslist.length == 0) {
        alert("There is no graph")
    }
    else {
        this.visited = [0];
        this.dfslist = [];
        this.dfsTraversal(1);
    }
  }

  build_graph()  {
    if(this.nodeslist.length>=1) {
      alert("First Clear This Graph");
    }

    else {
      for(var i=1; i<=parseInt(this.state.nodes); i++) {

        this.mousemoved.call(this, event);

        this.nodes.push({x: this.mouse.x, y: this.mouse.y});

        this.node = this.node.data(this.nodes).join(
              enter => enter.append("g").classed("gnode", true).append("circle").attr('r',15).attr("fill", "#000080")
        );

        this.text = this.text.data(this.nodes).join(
                enter => enter.append("g").classed("gnode", true).append("text").text(i).attr("fill", "white")
        );

        this.node_dict[i] = this.nodes[this.nodes.length - 1];

        this.nodeslist.push(i);
        this.visited.push(0);
        this.Graph[i] = new Set();

        this.simulation.nodes(this.nodes);
        this.simulation.alpha(1).restart();
      }

      let texts = this.state.edges;
      texts = texts.split(/\r|\n/);

     for(var i=0; i<texts.length; i++) {
          var h = texts[i].split(" ");

          let source = parseInt(h[0]);
          let destination = parseInt(h[1]);

          this.links.push({source: this.node_dict[source], target: this.node_dict[destination]});

          this.Graph[source].add(destination);
          this.Graph[destination].add(source);

          this.link = this.link.data(this.links).join(
                enter => enter.append("line").attr("stroke", "red")
            );
          
          this.simulation.force("link").links(this.links);
          this.simulation.restart();
      } 
    }
  }

  reset() {
    console.log('reset called')
    this.nodes.splice(0,this.nodes.length);
    this.links.splice(0,this.links.length);
    this.node_dict = {}
    this.nodeslist = [];
    this.Graph = {}
    this.visited = [0];
    this.dfslist = [];

    this.setState({
      dfs_sequence : '  Sequence'
    });

    this.node = this.node.data(this.nodes).join(
      enter => enter.append("g").classed("gnode", true).append("circle").attr('r',15).attr("fill", "#000080")
      );

    this.text = this.text.data(this.nodes).join(
        enter => enter.append("g").classed("gnode", true).append("text").text(0).attr("fill", "white")
      );

    this.link = this.link.data(this.links).join(
        enter => enter.append("line").attr("stroke", "red")
      );

    this.simulation.nodes(this.nodes);
    this.simulation.force("link").links(this.links);
    this.simulation.alpha(1).restart();
  }

    handleNodesChange = (event) => {
      this.setState({
          nodes : event.target.value
      })
    }

    handleEdgesChange = (event) => {
      this.setState({
          edges : event.target.value
      })
    }

    render() {
      const inputStyle = {
        marginLeft : "10px"
      }

      const buttonStyle = {
        marginLeft : "10px"
      }

      const secondDiv = {
        display : "inline-block",
        marginLeft : "200px",
        position : "absolute",
        bottom : "820px"
      }

      const firstDiv = {
        display : "inline-block",
      }

      const thirdDiv = {
        display : "inline-block",
        backgroundColor : "white",
        position : "absolute",
        bottom : "50px",
        marginLeft : "200px",
        width : "600px",
        height : "700px",
        borderRadius : "10px"
      }

      const header = {
        marginRight : "500px",
      }

      const fourthDiv = {
          display : "inline-block",
      }

      const logo = require('../dfs.png'); 
      
        return(
            <div>
              <div style={header}>

              <div style={firstDiv}>
                  <img 
                    src={logo} 
                  />
              </div>

              <div style={secondDiv}>
                  <input 
                      type="number" 
                      placeholder="Add Nodes" 
                      value={this.state.nodes} 
                      onChange= {this.handleNodesChange}
                      style={inputStyle}
                  />
                  
                  <textarea 
                      placeholder="Add Edges" 
                      value={this.state.edges}
                      onChange={this.handleEdgesChange}
                      style={inputStyle}
                      rows="6"
                      cols= "30"
                  />

                  <button 
                      onClick={this.build_graph.bind(this)}
                      style={buttonStyle}
                    >
                      Built
                  </button>

                  <button 
                    style={buttonStyle}
                    onClick={this.DFS.bind(this)}
                    >
                      DFS
                  </button>

                  <button 
                    style={buttonStyle}
                    >
                      BFS
                  </button>

                  <button 
                    style={buttonStyle}
                    onClick={this.reset.bind(this)}
                    >
                      Reset
                  </button>
              </div>
            </div>

            <div>
                <div style={fourthDiv}>
                    <svg>
                    </svg>
                </div>

                <div style={thirdDiv}>
                    <h1>{this.state.dfs_sequence}</h1>
                </div>
            </div>

          </div>
        );
    }
  }


export default DashBoard