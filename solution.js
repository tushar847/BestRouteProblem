
let noOfCustomers = 2;
let V = 5;
let INF =  1e7;
let graph = [ [ 0, 3, 2, INF, INF],
              [ 3, 0, 2, 2, 2],
              [ 2, 2, 0, 2, 2],
              [ INF, 2, 2, 0, 2],
              [ INF, 2, 2, 2, 0 ]];


let MAXN = noOfCustomers*2+1;
let dis = new Array(MAXN);
let Next = new Array(MAXN);
let mappings = new Map();

function setupEnvironment() {
    for(let i = 0; i < MAXN; i++)
    {
        dis[i] = new Array(MAXN);
        Next[i] = new Array(MAXN);
    }
    
    for (let i=0;i<2*noOfCustomers;i++) {
        if (i > Math.floor(noOfCustomers/2)) {
            mappings.set("c"+(i+1-noOfCustomers),i+1)
        }
        else {
            mappings.set("r"+(i+1),i+1)
        }
    }
    mappings.set("a",0);
}


function initialise(V, graph)
{
    for(let i = 0; i < V; i++)
    {
        for(let j = 0; j < V; j++)
        {
            dis[i][j] = graph[i][j];
            if (graph[i][j] == INF)
                Next[i][j] = -1;
            else
                Next[i][j] = j;
        }
    }
}
  
function floydWarshall(V)
{
    for(let k = 0; k < V; k++)
    {
        for(let i = 0; i < V; i++)
        {
            for(let j = 0; j < V; j++)
            {
                 
                if (dis[i][k] == INF ||
                    dis[k][j] == INF)
                    continue;
                      
                if (dis[i][j] > dis[i][k] +
                                dis[k][j])
                {
                    dis[i][j] = dis[i][k] +
                                dis[k][j];
                    Next[i][j] = Next[i][k];
                }
            }
        }
    }
}
 
function generateDesiredInputArrayForPaths(n) {
    let inputArray = [];
    for (i=0;i<n;i++) {
        inputArray.push("r"+(i+1));
    }
    for (i=0;i<n;i++) {
        inputArray.push("c"+(i+1));
    }
    return inputArray;
} 

function generateAllValidPaths(n) {
    let input = generateDesiredInputArrayForPaths(n);
    let stack = ["a"];
    var result = [];

    function backTrack(char,rcount,ccount) {
        if (stack.length == input.length+1) {
            result.push([...stack]);
            return
        }
        for (c of input) {
            rp = false;
            cp = false;
            if (char != c && !(stack.includes(c))) {
                if (c[0] == "r") {
                    rcount+=1
                    rindex = Number(c[1])
                    rp = true
                }
                else if (c[0] == "c") {
                    cindex = Number(c[1]);
                    if (stack.includes(("r"+cindex))){
                        ccount +=1
                        cp = true;
                    }
                    else{
                        continue
                    }
                        
                }
                if (ccount > rcount) {
                    if (rp) {
                        rcount-=1;
                    }
                    if (cp) {
                        ccount-=1;
                    }
                    continue
                }
                
                stack.push(c)
                backTrack(c,rcount,ccount)
                stack.pop()
                if (rp) {
                    rcount-=1;
                }
                if (cp) {
                    ccount-=1;
                }
            }                          
        }
    }
    for (let i=0;i<n;i++) {
        stack.push(input[i])
        backTrack(input[i],1,0)
        stack.pop()
    }
    return result
}

function findBestRoute(n) {

    let paths = generateAllValidPaths(n);
    let pathSums = [];
    for (path of paths) {
        let pthsum = 0;
        for (let i = 0;i<path.length-1;i++) {
            pthsum+=dis[mappings.get(path[i])][mappings.get(path[i+1])];
        }
        pathSums.push(pthsum);
    }
    return {
        path: paths[pathSums.indexOf(Math.min.apply(null,pathSums))],
        pathSum: Math.min.apply(null,pathSums)
    };
}

setupEnvironment();
initialise(V, graph);
floydWarshall(V);
let optimalRoute = findBestRoute(noOfCustomers);
console.log("optimal path", optimalRoute.path);
console.log("time taken", optimalRoute.pathSum);

