// shared/utils/performanceTracker.ts

interface PerformanceEvent {
  name: string;
  timestamp: number;
  duration?: number;
  details?: any;
}

class PerformanceTracker {
  private events: PerformanceEvent[] = [];
  private startTime: number = 0;

  start(name: string = 'AppStart') {
    this.startTime = performance.now();
    this.addEvent(name, { phase: 'start' });
    console.log(`🚀 [PerformanceTracker] ${name} 시작: ${this.startTime.toFixed(2)}ms`);
  }

  addEvent(name: string, details?: any) {
    const timestamp = performance.now();
    const event: PerformanceEvent = {
      name,
      timestamp,
      details
    };
    
    this.events.push(event);
    
    const relativeTime = timestamp - this.startTime;
    console.log(`📊 [PerformanceTracker] ${name}: ${relativeTime.toFixed(2)}ms (절대: ${timestamp.toFixed(2)}ms)`);
  }

  addDuration(name: string, startTime: number, details?: any) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const event: PerformanceEvent = {
      name,
      timestamp: endTime,
      duration,
      details
    };
    
    this.events.push(event);
    
    const relativeTime = endTime - this.startTime;
    console.log(`⏱️ [PerformanceTracker] ${name}: ${duration.toFixed(2)}ms (누적: ${relativeTime.toFixed(2)}ms)`);
  }

  getReport() {
    const totalTime = this.events.length > 0 
      ? this.events[this.events.length - 1].timestamp - this.startTime 
      : 0;

    console.log('\n📈 [성능 리포트] ========================================');
    console.log(`🏁 총 소요 시간: ${totalTime.toFixed(2)}ms`);
    console.log('📋 세부 타임라인:');
    
    this.events.forEach((event, index) => {
      const relativeTime = event.timestamp - this.startTime;
      const durationText = event.duration ? ` (${event.duration.toFixed(2)}ms)` : '';
      console.log(`  ${index + 1}. ${event.name}: ${relativeTime.toFixed(2)}ms${durationText}`);
    });
    
    console.log('=================================================\n');
    return { totalTime, events: this.events };
  }

  reset() {
    this.events = [];
    this.startTime = 0;
    console.log('🔄 [PerformanceTracker] 리셋 완료');
  }
}

export const performanceTracker = new PerformanceTracker();