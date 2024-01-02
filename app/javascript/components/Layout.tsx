import {Link, Outlet} from "react-router-dom";
import React from "react";

export default function Layout() {
    return (
        <div>
            <h1>Layout</h1>
            <Link to="/">Home</Link>
            <br/>
            <Link to="/note">Note</Link>
            <Outlet/>
        </div>
    );
}