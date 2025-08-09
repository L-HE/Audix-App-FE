// components/dev/PerformanceMonitor.tsx
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../shared/styles/global';
import { profiler } from '../../shared/utils/performance';

const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!__DEV__) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (autoRefresh && isVisible) {
      interval = setInterval(() => {
        setMeasurements(profiler.getMeasurements());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, isVisible]);

  const refreshData = () => {
    setMeasurements(profiler.getMeasurements());
  };

  const clearData = () => {
    profiler.clearMeasurements();
    setMeasurements([]);
  };

  const generateReport = () => {
    const report = profiler.generateReport();
    console.log(report);
    alert('Performance report generated! Check console for details.');
  };

  if (!__DEV__) return null;

  return (
    <>
      {/* Floating Performance Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 100,
          right: 10,
          backgroundColor: Colors.danger,
          borderRadius: 25,
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
        }}
        onPress={() => setIsVisible(true)}
      >
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
          PERF
        </Text>
      </TouchableOpacity>

      {/* Performance Monitor Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            maxHeight: '80%',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Performance Monitor
            </Text>

            {/* Control Buttons */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.buttonPrimary,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
                onPress={refreshData}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>Refresh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: autoRefresh ? Colors.normal : Colors.gray300,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
                onPress={() => setAutoRefresh(!autoRefresh)}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>
                  Auto: {autoRefresh ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: Colors.warning,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
                onPress={generateReport}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: Colors.danger,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
                onPress={clearData}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>Clear</Text>
              </TouchableOpacity>
            </View>

            {/* Performance Data */}
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Recent Measurements ({measurements.length}):
              </Text>
              
              {measurements.slice(-20).reverse().map((measurement, index) => (
                <View
                  key={index}
                  style={{
                    padding: 8,
                    backgroundColor: measurement.executionTime > 16 ? '#ffe6e6' : '#e6ffe6',
                    marginBottom: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                    {measurement.component ? `${measurement.component}.` : ''}
                    {measurement.functionName}
                  </Text>
                  <Text style={{ fontSize: 10, color: Colors.textSecondary }}>
                    {measurement.executionTime.toFixed(2)}ms
                  </Text>
                </View>
              ))}

              {measurements.length === 0 && (
                <Text style={{ textAlign: 'center', color: Colors.textSecondary }}>
                  No performance data available
                </Text>
              )}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              style={{
                backgroundColor: Colors.buttonPrimary,
                paddingVertical: 12,
                borderRadius: 6,
                marginTop: 16,
              }}
              onPress={() => setIsVisible(false)}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PerformanceMonitor;
