
document.getElementById('add-row-btn').onclick = () => {
  const tbody = document.querySelector('#edge-table tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" /></td>
    <td><input type="text" /></td>
  `;
  tbody.appendChild(newRow);
};

document.getElementById('delete-row-btn').onclick = () => {
  const tbody = document.querySelector('#edge-table tbody');
  const rows = tbody.querySelectorAll('tr');
  if (rows.length > 1) {
    tbody.removeChild(rows[rows.length - 1]);
  } else {
    alert('At least one row must remain.');
  }
};




function createLabel(text) {
  const fontSize = 80;
  const padding = 20;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Temporary set font to measure text size
  context.font = `${fontSize}px Arial`;
  const textWidth = context.measureText(text).width;

  // Set canvas size based on text size
  canvas.width = textWidth + padding * 2;
  canvas.height = fontSize + padding;

  // Redraw with correct size
  context.font = `${fontSize}px Arial`;
  context.fillStyle = 'white';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter; // smoother scaling

  // Create sprite
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);

  // Scale the sprite proportional to the canvas
  const scaleFactor = 0.15;  // tweak this to control final size
  sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

  return sprite;
}

// .nodeLabel(node => node.id)
//   .nodeAutoColorBy('id')



// Initialize the 3D graph
// const Graph = ForceGraph3D()
//   (document.getElementById('3d-graph'))
//   .graphData(graphData)
  
//    .nodeThreeObject(node => {
//     const group = new THREE.Group();

//     // Node sphere
//     const sphere = new THREE.Mesh(
//       new THREE.SphereGeometry(4),
//       new THREE.MeshBasicMaterial({ color: node.color || 'steelblue' })
//     );
//     group.add(sphere);

//     // Label
//     const label = createLabel(node.id);
//     label.position.y = 10;
//     group.add(label);

//     return group;
//   });

// Initialize graph instance globally
const Graph = ForceGraph3D()(document.getElementById('3d-graph'))
  .linkDirectionalArrowLength(5)
  .linkDirectionalArrowRelPos(1)
  .linkCurvature(0.3);

// Build graph from table rows
document.getElementById('build-graph-btn').onclick = () => {
  const rows = document.querySelectorAll('#edge-table tbody tr');
  const links = [];
  const nodeSet = new Set();

  rows.forEach(row => {
    const source = row.cells[0].querySelector('input').value.trim();
    const target = row.cells[1].querySelector('input').value.trim();
    if(source && target) {
      links.push({ source, target });
      nodeSet.add(source);
      nodeSet.add(target);
    }
  });

 const nodes = Array.from(nodeSet).map(id => ({ id, label: id }));

 Graph.graphData({ nodes, links })
    .nodeThreeObject(node => {
      const group = new THREE.Group();

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(4),
        new THREE.MeshBasicMaterial({ color: 'steelblue' })
      );
      group.add(sphere);

      const label = createLabel(node.label);
      label.position.y = 10;
      group.add(label);

      return group;
    });
};

// Build graph initially
document.getElementById('build-graph-btn').click();