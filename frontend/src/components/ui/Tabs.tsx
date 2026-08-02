import React from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs?: TabItem[];
  items?: TabItem[];
  activeTab?: string;
  activeId?: string;
  onTabChange?: (id: string) => void;
  onChange?: (id: string) => void;
}

export function Tabs({ tabs, items, activeTab, activeId, onTabChange, onChange }: TabsProps) {
  const displayTabs = tabs || items || [];
  const currentActive = activeTab || activeId;
  const triggerChange = onTabChange || onChange;

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 backdrop-blur rounded-full w-max border border-slate-200/30">
      {displayTabs.map((tab) => {
        const isActive = currentActive === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => triggerChange && triggerChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-white text-primary shadow-sm shadow-slate-900/5 font-extrabold"
                : "text-text-gray hover:text-text-dark"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
