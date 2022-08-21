const sortable = ({ id, onUpdate = () => {}, onComplete = () => {} }) => {
  var pos = {};
  var selectedElement;
  var clone;
  const container = document.getElementById(id);
  container.style.userSelect = "none";
  const mouseMoveHandler = (e) => {
    const children = [...container.children].filter(
      (child) => child.id != "sortable-clone" && child != selectedElement
    );
    const rect = selectedElement.getBoundingClientRect();

    let temp = {
      x: e.clientX ? e.clientX : e.touches[0].clientX,
      y: e.clientY ? e.clientY : e.touches[0].clientY,
    };

    selectedElement.style.top = rect.y + temp.y - pos.y + "px";
    selectedElement.style.left = rect.x + temp.x - pos.x + "px";
    pos = {
      x: e.clientX ? e.clientX : e.touches[0].clientX,
      y: e.clientY ? e.clientY : e.touches[0].clientY,
    };
    children.forEach((child) => {
      if (
        insert(child, pos) == "left" &&
        child.previousElementSibling != selectedElement &&
        child.previousElementSibling != clone
      ) {
        container.insertBefore(clone, child);
        container.insertBefore(selectedElement, child);
        onUpdate();
      }
      if (
        insert(child, pos) == "right" &&
        child.nextElementSibling != selectedElement &&
        child.nextElementSibling != clone
      ) {
        container.insertBefore(clone, child.nextElementSibling);
        container.insertBefore(selectedElement, child.nextElementSibling);
        onUpdate();
      }
    });
  };

  const mouseDownHandler = (e) => {
    e.preventDefault();
    const container = e.currentTarget;
    const children = [...container.children];
    pos = {
      x: e.clientX ? e.clientX : e.touches[0].clientX,
      y: e.clientY ? e.clientY : e.touches[0].clientY,
    };

    children.forEach((child) => {
      if (isSelected(child, pos)) {
        selectedElement = child;
        const rect = selectedElement.getBoundingClientRect();
        clone = selectedElement.cloneNode(true);
        clone.style.opacity = ".5";
        clone.id = "sortable-clone";
        container.insertBefore(clone, selectedElement);
        selectedElement.style.position = "absolute";
        selectedElement.style.top = rect.y + "px";
        selectedElement.style.left = rect.x + "px";
        selectedElement.style.width = rect.width + "px";
        selectedElement.style.height = rect.height + "px";
      }
    });
    if (!selectedElement) return;
    container.addEventListener("mousemove", mouseMoveHandler);
    container.addEventListener("touchmove", mouseMoveHandler);
  };

  const mouseUpHandler = (e) => {
   
    const container = e.currentTarget;
    container.removeEventListener("mousemove", mouseMoveHandler);
    container.removeEventListener("touchmove", mouseMoveHandler);
    if (selectedElement) {
      onComplete();
      selectedElement.removeAttribute("style");
      clone.remove();
      clone = null;
      selectedElement = null;
    }
  };
  container.addEventListener("mousedown", mouseDownHandler);
  container.addEventListener("mouseup", mouseUpHandler);

  container.addEventListener("touchstart", mouseDownHandler);
  container.addEventListener("touchend", mouseUpHandler);

  const isSelected = (elem, pos) => {
    if (
      pos.x > elem.offsetLeft &&
      pos.x < elem.offsetLeft + elem.offsetWidth &&
      pos.y > elem.offsetTop &&
      pos.y < elem.offsetTop + elem.offsetHeight
    ) {
      return true;
    }
    return false;
  };

  const insert = (elem, pos) => {
    if (pos.y > elem.offsetTop && pos.y < elem.offsetTop + elem.offsetHeight) {
      if (
        pos.x > elem.offsetLeft &&
        pos.x < elem.offsetLeft + elem.offsetWidth / 2
      ) {
        return "left";
      }
      if (
        pos.x > elem.offsetLeft + elem.offsetWidth / 2 &&
        pos.x < elem.offsetLeft + elem.offsetWidth
      ) {
        return "right";
      }
    }
    return "";
  };
};
