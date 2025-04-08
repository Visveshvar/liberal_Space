import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { io } from 'socket.io-client';

const WhiteBoard = () => {
  const canvasRef = useRef(null); //Reference to whiteboard canvas
  const [canvas, setCanvas] = useState(null); //state of whiteboard canvas
  const [brushColor, setBrushColor] = useState('#000000'); //state of brush color
  const [brushWidth, setBrushWidth] = useState(5); //state of brush width
  const [isDrawing, setIsDrawing] = useState(true); //state of Drawing(true or false)
  const [socket, setSocket] = useState(null); //state of socket connection
  const [roomId, setRoomId] = useState('default-room');

  //initialization of Canvas onMount
  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      isDrawingMode: true,
      backgroundColor: '#fff'
    });


    initCanvas.freeDrawingBrush = new fabric.PencilBrush(initCanvas);
    initCanvas.freeDrawingBrush.color = brushColor;
    initCanvas.freeDrawingBrush.width = brushWidth;

    setCanvas(initCanvas);
    const newSocket = io('http://localhost:3001'); //new socket connection creation
    setSocket(newSocket); // set socket state

    //on component dismount
    return () => {
      newSocket.disconnect();
      initCanvas.dispose();
    };
  }, []);

  //handling of canvas events
  useEffect(() => {
    if (!socket || !canvas) return; //check if socket and canvas exist

    //receives drawing data from other users
    const handleDrawing = (data) => {
      if (data.senderId === socket.id) return;
      fabric.util.enlivenObjects([data.path], (objects) => { 
        objects.forEach((obj) => {
          canvas.add(obj);
          canvas.renderAll();
        });
      });
    };
    //clear canvas
    const handleClearCanvas = () => {
      canvas.clear();
      canvas.setBackgroundColor('#ffffff', () => {
        canvas.renderAll();
      });
    };
    
    //handling of canvas state
    const handleCanvasState = (objects) => {
      if (canvas.getObjects().length === 0) {
        fabric.util.enlivenObjects(objects, (enlivenedObjects) => {
          canvas.clear();
          canvas.setBackgroundColor('#ffffff', () => {
            enlivenedObjects.forEach(obj => canvas.add(obj));
            canvas.renderAll();
          });
        });
      }
    };
  
    socket.on('drawing', handleDrawing);
    socket.on('clear-canvas', handleClearCanvas);
    socket.on('canvas-state', handleCanvasState);
    socket.emit('join-room', roomId);
  
    return () => {
      socket.off('drawing', handleDrawing);
      socket.off('clear-canvas', handleClearCanvas);
      socket.off('canvas-state', handleCanvasState);
    };
  }, [socket, canvas, roomId]);
  
  //emit drawing data to other users
  useEffect(() => {
    if (!canvas || !socket) return;

    const handlePathCreated = (e) => {
      const pathData = e.path.toObject();
      socket.emit('drawing', {
        path: pathData,
        roomId,
        senderId: socket.id
      });
    };

    canvas.on('path:created', handlePathCreated);

    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, socket, roomId]);
  
  useEffect(() => {
    if (!canvas || !socket) return;
    
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = brushWidth;
    canvas.isDrawingMode = isDrawing;
  }, [brushColor, brushWidth, isDrawing, canvas, socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleBrushUpdate = (data) => {
      setBrushColor(data.color);
      setBrushWidth(data.width);
      setIsDrawing(data.isDrawing);
    };

    return () => {
      socket.off('brush-update', handleBrushUpdate);
    };
  }, [socket]);

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#fff';
      canvas.renderAll();
      socket.emit('clear-canvas', roomId);
    }
  };

  const toggleDrawing = () => {
    setIsDrawing(prev => !prev);
    if (canvas) {
      canvas.isDrawingMode = !isDrawing;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Collaborative Whiteboard</h1>
      <p style={{ textAlign: 'center' }}>Room: {roomId}</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label>
            Brush Color:
            <input 
              type="color" 
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <div>
          <label>
            Brush Width: {brushWidth}px
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushWidth}
              onChange={(e) => setBrushWidth(parseInt(e.target.value))}
              style={{ marginLeft: '10px', width: '150px' }}
            />
          </label>
        </div>

        <button onClick={toggleDrawing}>
          {isDrawing ? '🖌 Drawing Mode' : '✋ Selection Mode'}
        </button>

        <button onClick={clearCanvas}>🗑 Clear Canvas</button>
      </div>

      <canvas 
        ref={canvasRef} 
        style={{ 
          border: '1px solid #000', 
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default WhiteBoard;