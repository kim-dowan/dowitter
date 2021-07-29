import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Dowitt = ({ dowittObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newDowitt, setNewDowitt] = useState(dowittObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this dowitt?");
        if (ok) {
            await dbService.doc(`dowitt/${dowittObj.id}`).delete();
            if (dowittObj.attachmentUrl !== "") await storageService.refFromURL(dowittObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`dowitt/${dowittObj.id}`).update({
            text: newDowitt,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDowitt(value);
    }

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" onChange={onChange} value={newDowitt} />
                        <input type="submit" value="Edit Dowitt" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <div style={{display: "inline-block", border: "1px solid lightgray"}}>
                    <h3 style={{display: "inline-block", padding: "0", margin: "0"}}>{dowittObj.creatorName}</h3>
                    <h4 style={{display: "inline-block", padding: "0", margin: "0"}}>{dowittObj.text}</h4>
                    {dowittObj.attachmentUrl && <img src={dowittObj.attachmentUrl} alt="dowitt_image" width="50px" height="50px" />}
                    {isOwner &&
                        <>
                            <button onClick={onDeleteClick}>Delete Dowitt</button>
                            <button onClick={toggleEditing}>Edit Dowitt</button>
                        </>
                    }
                </div>)
            }
        </div>
    );
}

export default Dowitt;