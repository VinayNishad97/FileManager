import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Link } from "react-router-dom";
import "../App.css";

function Sidebar() {
  const [files, setFiles] = useState([]);
  const [dir, setDir] = useState("");
  const [filename,Setfilename] = useState("");
  const [contextMenu,SetcontextMenu] = useState({
    visible:false,
    x:0,
    y:0
  });
  const [currentPath, setCurrentPath] = useState(["/home"]);

  async function fetchFiles(path) {
    try {
      const result = await invoke("read_dir", { path });
      setFiles(result);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }

  useEffect(() => {
    const path = currentPath.join("");
    setDir("");
    fetchFiles(path);
  }, [currentPath]);

  function redirect_dir() {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
    } else {
      alert("You can't go back any further");
    }
  }

  function openFolder(file) {
    if (!file.is_dir) return;

    setCurrentPath((prev) => [...prev, "/" + file.name]);
  }

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(dir.toLowerCase())
  );
const  clickhandler = (e)=>{
    e.preventDefault();
  SetcontextMenu({
    visible:true,
    x:e.clientX,
    y:e.clientY
  })
  }
const removecontextmenu = (e)=>{
  e.preventDefault();
  SetcontextMenu({
    visible:false,
  x:0,
  y:0
  });
}
let createfilefolderpath =  currentPath.join("");
const createfile= async(e)=>{
e.preventDefault();
let path  = createfilefolderpath+"/"+filename
await invoke("create_file",{path});
}
const createfolder = async(e)=>{
  e.preventDefault();
  let path  = createfilefolderpath+"/"+filename
await invoke("create_folder",{path})
}

  return (
    <>
    <div className="side-bar">
      <div className="strip-dir">
        <button onClick={redirect_dir} style={{ cursor: "pointer" }}>
          ⬅️
        </button>

        <Link to="/">Go to Greeting page</Link>

        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setDir(e.target.value)}
        />
      </div>

      <h2>{currentPath.join("")}</h2>
{contextMenu.visible && (
  <div
    className="context-menu"
    style={{
      position: "absolute",
      top: contextMenu.y,
      left: contextMenu.x
    }}
  >
    <p onClick={removecontextmenu} className="context-cut">X</p>
    <input  className="filename" onChange={(e)=>Setfilename(e.target.value)} type="text" placeholder="Name"/>
    <button className="context" onClick={createfile} >Create file</button>
    <button className="context" onClick={createfolder}>Create folder</button>
  </div>
)}
<div onContextMenu={clickhandler}>
     <div className="file-grid">
  {filteredFiles.map((file, index) => (
    <div
      key={index}
      onClick={() => openFolder(file)}
      className="file-item"
    >
      <div className="file-icon">
        {file.is_dir ? "📁" : "📄"}
      </div>
      <div className="file-name">{file.name}</div>
    </div>
  ))}
</div>
</div>
</div>
    </>
  );
}

export default Sidebar;