# How to use the Sleeper API

# Introduction

Last year I built [ffwrapped](https://ffwrapped.com/), an open source website that provides fantasy football league insights and stats. This project was made possible by the free, public [Sleeper API](https://docs.sleeper.com/). If you're curious about accessing detailed information about your leagues, the Sleeper API offers comprehensive data—all without any authentication. After working with this API for over a year and building a full-fledged app, I want to share how anyone can create their own project. For this tutorial, we’re going to make a simple bar chart that shows the total points scored from each league member.

# 1. Setup Your Project

The best way to demonstrate how to retrieve and visualize API data is to create our own project. The Sleeper API provides access to league data, transactions, rosters, matchups, player points, draft data, and much more. To get started, I recommend using [Vite](https://vite.dev/), a popular build tool. For more detailed instructions, take a look at their getting started [guide](https://vite.dev/guide/). I'll show you how to scaffold a simple project.

Run the following command in your terminal of choice.

```bash
# Create a new Vite project with React
npm create vite@latest fantasy-football-app -- --template react

# Navigate to the project directory
cd fantasy-football-app

# Install dependencies
npm install

# Install additional packages we'll need
npm install apexcharts react-apexcharts
```

For ffwrapped, I used Vue and TypeScript, but any frontend framework will work. For this tutorial, I'll use React because it's the most popular framework and most developers are already familiar with it.

# 2. Find Your League ID

Your Sleeper league ID is in the URL when viewing your league - [https://sleeper.app/leagues/<your_league_id>](https://sleeper.app/leagues/<your_league_id>).

# 3. Create Your Visualization Component

Create a file called `PointsGraph.jsx` in the `src` folder.

To start, we need to import the `useState` and `useEffect` hooks from react and then for the bar graph, we’re going to use the `apexcharts` library. In our `PointsGraph` component, we’re gonna pass in `leagueId` as props and setup three `useState` variables.

```jsx
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const PointsGraph = ({ leagueId }) => {
  const [chartData, setChartData] = useState(null); // values to pass into the apexchart
  const [isLoading, setIsLoading] = useState(true); // loading state when data is being fetched
  const [error, setError] = useState(null); // error state if there is an error when fetching data

  return <div></div>;
};
```

First we’ll need to retrieve the data we need from the Sleeper. We can use the fetch API and store the responses in variables `usersResponse` and `rostersResponse`. Since fetching data is a side effect, we need to use the `useEffect` hook.

```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch league users and rosters
      const [usersResponse, rostersResponse] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`).then(
          (res) => res.json()
        ),
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`).then(
          (res) => res.json()
        ),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load league data");
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, [leagueId]); // run every time leagueId changes
```

To make things easier, we can take `usersResponse` and map the `user_id` from each user and map it to their `display_name`. We need the mapping to connect each user’s total points from the rosters response to their user name. This should also be done in the `try` block to catch any errors.

```jsx
// Create user map for easy lookup
const userMap = {};
usersResponse.forEach((user) => {
  userMap[user.user_id] = user.display_name;
});
```

We can then map through the `rostersResponse` and get the data in the format we need. `teamData` here is an array of objects where each object has a `teamName` and `points` value. Then we can sort the array values by points, from highest to lowest. Finally, we can take `teamData` and use `setChartData` to update the `chartData` state. `chartData` can then be used in `chartOptions` where we’ll set the configuration for our points chart.

```jsx
// Format data into [{teamName: '', points: ''}...]
const teamData = rostersResponse.map((roster) => {
  const teamName = userMap[roster.owner_id];
  const points = roster.settings.fpts + roster.settings.fpts_decimal / 100;

  return {
    teamName,
    points,
  };
});
// Sort by points (highest first)
teamData.sort((a, b) => b.points - a.points);

// Prepare data for ApexCharts
setChartData({
  teams: teamData.map((team) => team.teamName),
  points: teamData.map((team) => parseFloat(team.points.toFixed(2))),
});
```

Then we’ll have to configure our `chartOptions`. This is what we’ll pass into the `apexChart` component. We’re gonna stick with fairly default settings but feel free to check out their [documentation](https://apexcharts.com/docs/series/) to see more options.

```
const chartOptions = {
  chart: {
    type: "bar",
    height: 500,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      dataLabels: {
        position: "bottom",
      },
    },
  },
  series: [
    {
      name: "Total Points",
      data: chartData.points,
    },
  ],
  xaxis: {
    categories: chartData.teams,
  },
  title: {
    text: "Total Fantasy Points by Team",
    align: "center",
  },
  };
```

Outside of the `useEffect` we can add a simple loading state and error handling.

```jsx
if (isLoading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;
if (!chartData) return <div>No data available</div>;
```

Finally, we can return the `Chart` with the `chartOptions` we created and then export the whole component.

```jsx
return (
  <div>
    <Chart
      options={chartOptions}
      series={chartOptions.series}
      type="bar"
      height={500}
    />
  </div>
);

export default PointsGraph;
```

# 4. Update App Component

The last step is to import the `PointsGraph` component we just made in the `App.jsx` file. Make sure to update the `LEAGUE_ID` value.

```jsx
import PointsGraph from "./PointsGraph";
import "./App.css";

function App() {
  // Replace with your actual league ID
  const LEAGUE_ID = "...";

  return (
    <div className="app">
      <header>
        <h1>Fantasy Football Points Visualization</h1>
      </header>
      <main>
        <PointsGraph leagueId={LEAGUE_ID} />
      </main>
    </div>
  );
}

export default App;
```

Here’s the final product! All of the source code can be found on github [here](https://github.com/kt474/sleeper-api-example).

![tutorial image](tutorial_img.png)
