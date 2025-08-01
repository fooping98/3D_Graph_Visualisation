// Example graph data
const graphData = {
  nodes: [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
  ],
  links: [
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'C', target: 'E' },
    { source: 'D', target: 'E' },
    { source: 'E', target: 'F' },
    { source: 'F', target: 'E' }
  ]
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





// Initialize the 3D graph
const Graph = ForceGraph3D()
  (document.getElementById('3d-graph'))
  .graphData(graphData)
  .nodeLabel(node => node.id)
  .nodeAutoColorBy('id')
   .nodeThreeObject(node => {
    const group = new THREE.Group();

    // Node sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(4),
      new THREE.MeshBasicMaterial({ color: node.color || 'steelblue' })
    );
    group.add(sphere);

    // Label
    const label = createLabel(node.id);
    label.position.y = 10;
    group.add(label);

    return group;
  })
   .linkDirectionalArrowLength(5)       // length of the arrowhead
  .linkDirectionalArrowRelPos(1)      // position of arrow along the link (1 = at target)
  .linkCurvature(0.3);