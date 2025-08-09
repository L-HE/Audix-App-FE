// shared/utils/performance.ts

interface PerformanceData {
  functionName: string;
  executionTime: number;
  timestamp: number;
  component?: string;
}

class PerformanceProfiler {
  private static instance: PerformanceProfiler;
  private measurements: PerformanceData[] = [];
  private isEnabled: boolean = __DEV__;

  static getInstance(): PerformanceProfiler {
    if (!PerformanceProfiler.instance) {
      PerformanceProfiler.instance = new PerformanceProfiler();
    }
    return PerformanceProfiler.instance;
  }

  // 함수 실행 시간 측정
  measureFunction<T extends any[], R>(
    functionName: string,
    fn: (...args: T) => R,
    component?: string
  ): (...args: T) => R {
    if (!this.isEnabled) {
      return fn;
    }

    return (...args: T): R => {
      const startTime = performance.now();
      const result = fn(...args);
      const endTime = performance.now();
      
      this.addMeasurement({
        functionName,
        executionTime: endTime - startTime,
        timestamp: Date.now(),
        component,
      });

      return result;
    };
  }

  // 비동기 함수 실행 시간 측정
  async measureAsyncFunction<T extends any[], R>(
    functionName: string,
    fn: (...args: T) => Promise<R>,
    component?: string,
    ...args: T
  ): Promise<R> {
    if (!this.isEnabled) {
      return fn(...args);
    }

    const startTime = performance.now();
    const result = await fn(...args);
    const endTime = performance.now();
    
    this.addMeasurement({
      functionName,
      executionTime: endTime - startTime,
      timestamp: Date.now(),
      component,
    });

    return result;
  }

  // 코드 블록 실행 시간 측정
  startMeasurement(label: string): () => void {
    if (!this.isEnabled) {
      return () => {};
    }

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      this.addMeasurement({
        functionName: label,
        executionTime: endTime - startTime,
        timestamp: Date.now(),
      });
    };
  }

  private addMeasurement(data: PerformanceData): void {
    this.measurements.push(data);
    
    // 개발 환경에서 콘솔에 로그 출력
    if (__DEV__) {
      console.log(`🚀 [Performance] ${data.component ? `${data.component}.` : ''}${data.functionName}: ${data.executionTime.toFixed(2)}ms`);
    }

    // 최대 1000개의 측정값만 보관
    if (this.measurements.length > 1000) {
      this.measurements = this.measurements.slice(-1000);
    }
  }

  // 성능 데이터 조회
  getMeasurements(component?: string): PerformanceData[] {
    if (component) {
      return this.measurements.filter(m => m.component === component);
    }
    return [...this.measurements];
  }

  // 컴포넌트별 평균 실행 시간
  getAverageExecutionTime(functionName: string, component?: string): number {
    const filtered = this.measurements.filter(m => 
      m.functionName === functionName && 
      (!component || m.component === component)
    );
    
    if (filtered.length === 0) return 0;
    
    const total = filtered.reduce((sum, m) => sum + m.executionTime, 0);
    return total / filtered.length;
  }

  // 가장 느린 함수들
  getSlowestFunctions(limit: number = 10): PerformanceData[] {
    return [...this.measurements]
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, limit);
  }

  // 성능 리포트 생성
  generateReport(): string {
    const slowest = this.getSlowestFunctions(5);
    const byComponent = this.groupByComponent();
    
    let report = '📊 Performance Report\n';
    report += '===================\n\n';
    
    report += '🐌 Slowest Functions:\n';
    slowest.forEach((data, index) => {
      report += `${index + 1}. ${data.component ? `${data.component}.` : ''}${data.functionName}: ${data.executionTime.toFixed(2)}ms\n`;
    });
    
    report += '\n📱 By Component:\n';
    Object.entries(byComponent).forEach(([component, measurements]) => {
      const avgTime = measurements.reduce((sum, m) => sum + m.executionTime, 0) / measurements.length;
      report += `${component}: ${measurements.length} calls, avg ${avgTime.toFixed(2)}ms\n`;
    });
    
    return report;
  }

  private groupByComponent(): Record<string, PerformanceData[]> {
    return this.measurements.reduce((acc, measurement) => {
      const key = measurement.component || 'Global';
      if (!acc[key]) acc[key] = [];
      acc[key].push(measurement);
      return acc;
    }, {} as Record<string, PerformanceData[]>);
  }

  // 측정값 초기화
  clearMeasurements(): void {
    this.measurements = [];
    console.log('🗑️ Performance measurements cleared');
  }

  // 프로파일러 활성화/비활성화
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`🔧 Performance profiler ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// 전역 인스턴스
export const profiler = PerformanceProfiler.getInstance();

// 데코레이터 스타일 함수
export const measure = (functionName?: string, component?: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const name = functionName || propertyKey;
    
    descriptor.value = profiler.measureFunction(name, originalMethod, component);
    return descriptor;
  };
};

// Hook for React components
export const usePerformanceProfiler = (componentName: string) => {
  const measureRender = () => {
    const endMeasurement = profiler.startMeasurement(`${componentName}.render`);
    return endMeasurement;
  };

  const measureFunction = <T extends any[], R>(
    functionName: string,
    fn: (...args: T) => R
  ) => {
    return profiler.measureFunction(`${componentName}.${functionName}`, fn, componentName);
  };

  return {
    measureRender,
    measureFunction,
    getMeasurements: () => profiler.getMeasurements(componentName),
    getAverageTime: (functionName: string) => profiler.getAverageExecutionTime(functionName, componentName),
  };
};
