import { useState, useEffect, useRef } from "react";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from "../constants/config";

// =====================
// 🔍 CUSTOM HOOK - GESTIONE ZOOM E PAN
// =====================

export function useZoom(areaRef) {
  // Zoom iniziale diverso per mobile - molto ridotto per vedere tutti i tavoli
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  let zoomIniziale = 1; // Desktop
  if (isSmallMobile) {
    zoomIniziale = 0.27; // Smartphone - vista panoramica completa
  } else if (isMobile) {
    zoomIniziale = 0.45; // Tablet - vista ampia
  }
  
  const [zoom, setZoom] = useState(zoomIniziale);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Stato per drag con mouse
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // Stato per touch
  const touchState = useRef({
    isTouching: false,
    startPos: null,
    startDistance: null,
    startZoom: 1,
    startOffset: { x: 0, y: 0 }
  });

  // ========== ZOOM CON ROTELLINA MOUSE ==========
  useEffect(function() {
    const area = areaRef.current;
    if (!area) return;

    function handleWheel(e) {
      e.preventDefault();
      const delta = -e.deltaY * ZOOM_STEP;
      setZoom(function(prevZoom) {
        return Math.min(Math.max(prevZoom + delta, ZOOM_MIN), ZOOM_MAX);
      });
    }

    area.addEventListener("wheel", handleWheel, { passive: false });
    return function() {
      area.removeEventListener("wheel", handleWheel);
    };
  }, [areaRef]);

  // ========== PAN CON MOUSE ==========
  useEffect(function() {
    const area = areaRef.current;
    if (!area) return;

    function handleMouseDown(e) {
      // Ignora se hai cliccato su un tavolo
      if (e.target.closest('.tavolo')) return;
      
      isDragging.current = true;
      dragStart.current = { 
        x: e.clientX - offset.x, 
        y: e.clientY - offset.y 
      };
      area.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
      if (!isDragging.current) return;
      
      setOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }

    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        area.style.cursor = 'grab';
      }
    }

    area.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return function() {
      area.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [offset, areaRef]);

  // ========== PAN E ZOOM CON TOUCH ==========
  useEffect(function() {
    const area = areaRef.current;
    if (!area) return;

    function calcDistance(touch1, touch2) {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(e) {
      // Ignora se hai toccato un tavolo
      if (e.target.closest('.tavolo')) return;
      
      touchState.current.isTouching = true;

      if (e.touches.length === 1) {
        // 1 dito = PAN - salva posizione iniziale
        touchState.current.startPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        touchState.current.startOffset = { 
          x: offset.x, 
          y: offset.y 
        };
        touchState.current.startDistance = null;
      } else if (e.touches.length === 2) {
        // 2 dita = ZOOM
        e.preventDefault();
        touchState.current.startDistance = calcDistance(e.touches[0], e.touches[1]);
        touchState.current.startZoom = zoom;
        touchState.current.startPos = null;
      }
    }

    function handleTouchMove(e) {
      if (!touchState.current.isTouching) return;

      if (e.touches.length === 1 && touchState.current.startPos) {
        // PAN - movimento diretto
        e.preventDefault();
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        // Calcola quanto si è spostato il dito
        const deltaX = currentX - touchState.current.startPos.x;
        const deltaY = currentY - touchState.current.startPos.y;
        
        // Applica lo spostamento
        setOffset({
          x: touchState.current.startOffset.x + deltaX,
          y: touchState.current.startOffset.y + deltaY
        });
        
      } else if (e.touches.length === 2 && touchState.current.startDistance) {
        // ZOOM
        e.preventDefault();
        
        const currentDistance = calcDistance(e.touches[0], e.touches[1]);
        const ratio = currentDistance / touchState.current.startDistance;
        
        const newZoom = touchState.current.startZoom * ratio;
        const clampedZoom = Math.min(Math.max(newZoom, ZOOM_MIN), ZOOM_MAX);
        
        setZoom(clampedZoom);
      }
    }

    function handleTouchEnd(e) {
      if (e.touches.length === 0) {
        // Tutti i diti sollevati - reset completo
        touchState.current = {
          isTouching: false,
          startPos: null,
          startDistance: null,
          startZoom: zoom,
          startOffset: { x: offset.x, y: offset.y }
        };
      } else if (e.touches.length === 1) {
        // Da 2 dita a 1 dito - reinizializza per pan
        touchState.current.startPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        touchState.current.startOffset = { 
          x: offset.x, 
          y: offset.y 
        };
        touchState.current.startDistance = null;
        touchState.current.isTouching = true;
      }
    }

    area.addEventListener('touchstart', handleTouchStart, { passive: false });
    area.addEventListener('touchmove', handleTouchMove, { passive: false });
    area.addEventListener('touchend', handleTouchEnd, { passive: false });
    area.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return function() {
      area.removeEventListener('touchstart', handleTouchStart);
      area.removeEventListener('touchmove', handleTouchMove);
      area.removeEventListener('touchend', handleTouchEnd);
      area.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [offset, zoom, areaRef]);

  // ========== FUNZIONI ZOOM PROGRAMMATICO ==========
  function zoomIn() {
    setZoom(function(prevZoom) {
      return Math.min(prevZoom + 0.15, ZOOM_MAX); // Step più grande per mobile
    });
  }

  function zoomOut() {
    setZoom(function(prevZoom) {
      return Math.max(prevZoom - 0.15, ZOOM_MIN); // Step più grande per mobile
    });
  }

  return { zoom, offset, zoomIn, zoomOut };
}
