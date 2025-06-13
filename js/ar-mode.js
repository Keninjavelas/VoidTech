document.getElementById('ar-button').addEventListener('click', async () => {
  try {
    if (!navigator.xr) {
      throw new Error("WebXR not supported");
    }
    
    const session = await navigator.xr.requestSession('immersive-ar');
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
    
    // Add AR-specific lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2);
    scene.add(light);
    
  } catch (error) {
    alert(`AR failed: ${error.message}`);
    console.error(error);
  }
});