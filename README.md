# BestRouteProblem Solution

# Input Description
I am assuming that the weight of the graphs represent the time which can be calulated.
In order to run the code we will have to construct the graph on our own.
and alter the values of a few variables like noOfCustomer is the count of the customers and V is the no of vertex in the graph.

## Graph Structure

![Graph.jpg](/Images/Graph.jpg)

Following is the representation of the graph

|  | a | r1 | r2 | c1 | c2 |
| --- | --- | --- | --- | --- | --- |
| a | 0 | 2 | 2 | inf | inf |
| r1 | 2 | 0 | 2 | 2 | 2 |
| r2 | 2 | 2 | 0 | 2 | 2 |
| c1 | inf | 2 | 2 | 0 | 2 |
| c2 | inf | 2 | 2 | 2 | 0 |

If we want to consider the preparation time as well then we can just use the max(pathweight,prepTime) and enter the same for source to restaurant paths. for the above graph if the preptime is 2 then the graph becomes the following.

|  | a | r1 | r2 | c1 | c2 |
| --- | --- | --- | --- | --- | --- |
| a | 0 | max(2,2) = 2 | max(2,2) = 2 | inf | inf |
| r1 | 2 | 0 | 2 | 2 | 2 |
| r2 | 2 | 2 | 0 | 2 | 2 |
| c1 | inf | 2 | 2 | 0 | 2 |
| c2 | inf | 2 | 2 | 2 | 0 |

if we intend to make a graph with 3 customers then the following pattern should be used

|  | a | r1 | r2 | r3 | c1 | c2 | c3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| a | - | - | - | - | - | - | - |
| r1 | - | - | - | - | - | - | - |
| r2 | - | - | - | - | - | - | - |
| r3 | - | - | - | - | - | - | - |
| c1 | - | - | - | - | - | - | - |
| c2 | - | - | - | - | - | - | - |
| c3 | - | - | - | - | - | - | - |

For running the code we will have to modify the following parameters.

```jsx
let noOfCustomers = 2;
let V = 5;
let INF =  1e7;
let graph = [ [ 0, 3, 2, INF, INF],
              [ 3, 0, 2, 2, 2],
              [ 2, 2, 0, 2, 2],
              [ INF, 2, 2, 0, 2],
              [ INF, 2, 2, 2, 0 ]];
```

<aside>
💡 The above is configuration represents the following graph.

</aside>

![Graph2.jpg](/Images/Graph2.jpg)

# How to run the code.

use the following commands to clone and run the code locally.

```jsx
1) git clone https://github.com/tushar847/BestRouteProblem.git
2) cd BestRouteProblem
3) node solution.js
```

# Solution Design

The given problem is a modified travelling salesman problem but harder than that , because we also have to keep in mind the order in which the delivery person needs to visit the nodes of the graph.

We will be solving the problem by solving two sub problems.

- Get all pair shortest path.
- Get all possible path.

We use the floyd warshall algorithm to find the all pair shortest path in the given graph.

For generating all possible valid path we use the concept of backtracking. 

## Generate All Possible Paths

![Tree.jpg](/Images/Tree.jpg)

From the above picture we can come up with the following important points for generating the valid paths.

```jsx
1) We need to start with the resutants first
2) if resturant count is more than customer count then only we consider
customers 
3) We insert the customer only when the corresponding restaurants is already 
covered in the path
```

Following is the code snippet for the generation of the paths.

```jsx
function generateAllValidPaths(n) {
    let input = generateDesiredInputArrayForPaths(n); // ["r1","r2","c1","c2"]
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
```

## Floyd Warshall Algorithm

Floyd warshall algorithm is used for the getting the all pair shortest path, which is further used to calculate the pathsum of all valid paths and then the minimum pathsum path is returned to the user

## Final Algorithm

For every single valid path we try to calculate the pathsum , since we have already calculated all pair shortest path using floyd warshall algorithm it is just simply adding the shortest path value.

```jsx
For eg ["a","r1","r2","c1","c2"] -> consider this path
then the pathsum = shortestPath("a","r1")+shortestPath("r1","r2")+
									 shortestPath("r2","c1")+shortestPath("c1","c2")

Since the shortes pathsum will correspond to the optimal path therefore we return the 
the path with the shortest pathsum which is the desired solution.
In case of multiple minimum paths we are returning only one.
```

## Test run

```jsx
let noOfCustomers = 2;
let V = 5;
let INF =  1e7;
let graph = [ [ 0, 3, 2, INF, INF],
              [ 3, 0, 2, 2, 2],
              [ 2, 2, 0, 2, 2],
              [ INF, 2, 2, 0, 2],
              [ INF, 2, 2, 2, 0 ]];
```

![Graph2.jpg](/Images/Graph2.jpg)

For the above graph we know all the paths starting from r2 will be the minimum but we are just return one of the path which gives us the minimum path sum.

```jsx
// code ouput 
["a","r2","r1","c1","c2"]
// expectd output
any of among the following (
["a","r2","r1","c1","c2"],
["a","r2","r1","c2","c1"],
["a","r2","c2","r1","c1"])

// Test result 
Passed.
```