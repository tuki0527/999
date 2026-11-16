import type React from 'react';
import type { DemoComponentProps } from '../types/wiki';
import { AbstractionDemo } from './AbstractionDemo';
import { BankAccountDemo } from './BankAccountDemo';
import { CouplingDemo } from './CouplingDemo';
import { DependencyInjectionDemo } from './DependencyInjectionDemo';
import { MvcBooksDemo } from './MvcBooksDemo';
import { PolymorphismDemo } from './PolymorphismDemo';
import { StudentRosterDemo } from './StudentRosterDemo';
import { TodoRefactorDemo } from './TodoRefactorDemo';
import { VehicleDesignDemo } from './VehicleDesignDemo';

export const demoRegistry: Record<string, React.ComponentType<DemoComponentProps>> = {
  'student-roster': StudentRosterDemo,
  'bank-account': BankAccountDemo,
  'vehicle-engine': VehicleDesignDemo,
  'animal-chorus': PolymorphismDemo,
  'shape-canvas': AbstractionDemo,
  'order-notifier': CouplingDemo,
  'book-mvc-flow': MvcBooksDemo,
  'todo-refactor': TodoRefactorDemo,
  'file-processor-di': DependencyInjectionDemo,
};

export function getDemoComponent(
  demoId: string | null
): React.ComponentType<DemoComponentProps> | null {
  if (!demoId) return null;
  return demoRegistry[demoId] ?? null;
}
