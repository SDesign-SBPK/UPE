import { Component } from "react";

export default class WeatherForm extends Component {
    render() {
        return (
            <div>
                <div className="weather-form-cols">
                    <div className="weather-form-col">
                        <p>Wind Speed</p>
                        <p>Precipitation</p>
                        <p>Temperature</p>
                        <p>Humidity</p>
                    </div>
                    <div className="weather-form-col">
                        <p><input type = "number" value = {this.props.wind} 
                            onChange={(e) => {

                            }}
                        /></p>
                        <p><input type = "decimal" value = {this.props.precipitation}
                            onChange={(e) => {

                            }}
                        /></p>
                        <p><input type = "number" value = {this.props.temperature}
                            onChange={(e) => {

                            }}
                        /></p>
                        <p><input type = "number" value = {this.props.humidity} 
                            onChange={(e) => {

                            }}
                        /></p>
                    </div>
                    <div className="weather-form-col">
                        <p>mph</p>
                        <p>inches</p>
                        <p>°F</p>
                        <p>%</p>
                    </div>
                </div>
                <div>
                    <h3>Input Weather Factors</h3>
                    <label htmlFor="wind">Wind</label><br />
                        <input type = "number" value = {this.props.wind} 
                            onChange={(e) => {

                            }}
                        />
                </div>
            </div>
        );
    }
}