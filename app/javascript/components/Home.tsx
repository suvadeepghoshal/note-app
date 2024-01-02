import React from "react";
import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>This is the home page, you can find a link to the
                <Link to="/note"> Note </Link>
                section here</p>
        </div>
    );
}