import Dowitt from "components/dowitt";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "style/Home.css"

var bubbleSort = function(array) {
    var length = array.length;
    var i, j, temp;
    for (i = 0; i < length - 1; i++) { // 순차적으로 비교하기 위한 반복문
      for (j = 0; j < length - 1 - i; j++) { // 끝까지 돌았을 때 다시 처음부터 비교하기 위한 반복문
        if (array[j].createdAt < array[j + 1].createdAt) { // 두 수를 비교하여 앞 수가 뒷 수보다 크면
          temp = array[j]; // 두 수를 서로 바꿔준다
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  };

const Home = ({ userObj }) => {
    const [dowitt, setDowitt] = useState("");
    const [dowitts, setDowitts] = useState([]);
    const [attachment, setAttachment] = useState("");
    useEffect(() => {
        dbService.collection("dowitt").onSnapshot((snapshot) => {
            const dowittArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDowitts(bubbleSort(dowittArray));
        });
    }, []);
    const onSubmit = async (event) => {
        if (dowitt === "" && attachment === "") return
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const dowittObj = {
            text: dowitt,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
            creatorName: userObj.displayName,
        };

        await dbService.collection("dowitt").add(dowittObj);
        setDowitt("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setDowitt(value);
    };
    const onFileChange = async (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        if (theFile) {
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
                const {
                    currentTarget: { result },
                } = finishedEvent;
                setAttachment(result);
            };
            reader.readAsDataURL(theFile);
        } else {
            setAttachment("");
        }
    };
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={dowitt}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Dowitt" className="submit"/>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" alt="dowitt_image"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {dowitts.map((dowitt) => (
                    <Dowitt
                        key={dowitt.id}
                        dowittObj={dowitt}
                        isOwner={dowitt.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;