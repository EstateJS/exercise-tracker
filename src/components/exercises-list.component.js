import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { unsubscribeMessageAsync, unsubscribeUpdatesAsync, 
    getWorker, subscribeMessageAsync, subscribeUpdatesAsync,
    addUpdateListener } from 'estate-js';
import { ExerciseAdded, ExerciseTrackerWorker } from 'exercise-tracker-service';

const ExerciseItem = props => (
    <tr>
        <td>{props.exercise.user.username}</td>
        <td>{props.exercise.description}</td>
        <td>{props.exercise.duration} minutes</td>
        <td>{props.exercise.date.toString().substring(0, 10)}</td>
        <td>
            <Link to={"/edit/" + props.exercise.primaryKey}>edit</Link> | <a href="#" onClick={async () => {
            await props.deleteExerciseAsync(props.exercise.primaryKey)
        }}>delete</a>
        </td>
    </tr>
)

export default class ExercisesList extends Component {
    constructor(props) {
        super(props);

        this.deleteExerciseAsync = this.deleteExerciseAsync.bind(this)

        this.state = {
            exercises: [],
            interval_handle: null
        };
    }

    async componentWillUnmount() {
        //stop listening for changes when we leave this page
        // note: You don't strictly have to do this but it's good practice to conserve Estate resources.
        if (this.state.exercises && this.state.exercises.length > 0)
            await unsubscribeUpdatesAsync(this.state.exercises);

        //stop listening for new exercises when we leave this page
        await unsubscribeMessageAsync(this.state.worker, ExerciseAdded);

        clearInterval(this.state.intervalHandle);
    }

    async componentDidMount() {
        try {
            const onUpdate = (e) => {
                if (e.deleted) {
                    //When it's been deleted, remove it from the state
                    this.setState(prevstate => ({
                        exercises: prevstate.exercises.filter(ex => ex.primaryKey !== e.target.primaryKey)
                    }));
                    console.log(`Exercise ${e.target.primaryKey} deleted`);
                } else {
                    //When it's been updated, trigger a re-render.
                    this.setState(this.state);
                }
            };

            //Get a reference to the exercise tracker worker
            const worker = getWorker(ExerciseTrackerWorker, 'default');
            this.setState({
                worker: worker
            });

            //Tell Estate we want to receive the ExerciseAdded message when its sent by the ExerciseTrackerWorker.
            await subscribeMessageAsync(worker, ExerciseAdded, async exerciseAdded => {
                const exercise = exerciseAdded.exercise;

                this.setState(prevstate => ({
                    exercises: [...prevstate.exercises, exercise] //add the exercise to the list of known exercises
                }));

                //Tell Estate we want to receive all updates to this new exercise and...
                await subscribeUpdatesAsync(exercise);

                // ... fire onUpdate when it's updated.
                addUpdateListener(exercise, onUpdate);

                console.log(`Exercise ${exercise.primaryKey} added from event handler`);
            });

            //Get all the exercises
            const exercises = await worker.getExercisesAsync();

            this.setState({
                exercises: exercises
            });

            //Tell Estate we want to receive all updates to all the exercises and...
            if (exercises && exercises.length > 0) {
                await subscribeUpdatesAsync(exercises);
                // ... fire onUpdate when any of them change.
                addUpdateListener(exercises, onUpdate);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteExerciseAsync(primaryKey) {
        try {
            //Delete the exercise by its primary_key.
            console.log(`Calling delete on ${primaryKey}`);
            await this.state.worker.deleteExerciseAsync(primaryKey);
        } catch (error) {
            console.error(error);
        }
    }

    exerciseList() {
        return this.state.exercises.map(currentexercise => {
            return <ExerciseItem exercise={currentexercise}
                                 deleteExerciseAsync={this.deleteExerciseAsync}
                                 key={currentexercise.primaryKey}
            />;
        })
    }

    render() {
        return (
            <div>
                <h3>Logged Exercises</h3>
                <table className="table">
                    <thead className="thead-light">
                    <tr>
                        <th>Username</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.exerciseList()}
                    </tbody>
                </table>
            </div>
        )
    }
}