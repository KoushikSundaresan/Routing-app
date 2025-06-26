import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { uaeEVModels } from '@/data/evModels';
import { EVModel } from '@/types/ev';
import { calculateChargingTime } from '@/utils/charging';

interface EVSelectorProps {
  selectedModel?: EVModel;
  onModelSelect: (model: EVModel) => void;
}

const EVSelector: React.FC<EVSelectorProps> = ({ selectedModel, onModelSelect }) => {
  const handleModelChange = (modelId: string) => {
    const model = uaeEVModels.find(m => m.id === modelId);
    if (model) {
      onModelSelect(model);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Select Your EV Model</label>
        <Select value={selectedModel?.id} onValueChange={handleModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your electric vehicle" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {uaeEVModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    {model.make} {model.model} ({model.year})
                  </span>
                  {model.isPopularInUAE && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Popular in UAE
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedModel && (
        <Card className="animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedModel.make} {selectedModel.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedModel.year} Model
                </p>
              </div>
              {selectedModel.isPopularInUAE && (
                <Badge variant="default" className="gradient-electric text-white">
                  UAE Popular
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Battery:</span>
                  <span className="font-medium">{selectedModel.batteryCapacity} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium">{selectedModel.efficiency} Wh/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Range:</span>
                  <span className="font-medium">
                    {Math.round((selectedModel.batteryCapacity * 1000) / selectedModel.efficiency)} km
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fast Charging:</span>
                  <span className="font-medium">{selectedModel.maxChargingSpeed} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium">{selectedModel.mass} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ports:</span>
                  <span className="font-medium">{selectedModel.chargingPorts.length} types</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Charging Connectors:</p>
              <div className="flex flex-wrap gap-1">
                {selectedModel.chargingPorts.map((port, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {port.type} ({port.maxPower}kW)
                  </Badge>
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Est. 20-80% Fast Charge:{" "}
                <span className="font-semibold">
                  {Math.round(
                    calculateChargingTime({
                      batteryCapacity: selectedModel.batteryCapacity,
                      initialSOC: 20,
                      targetSOC: 80,
                      chargingPower: selectedModel.maxChargingSpeed
                    })
                  )} min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EVSelector;
