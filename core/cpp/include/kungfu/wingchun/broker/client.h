//
// Created by Keren Dong on 2020/3/12.
//

#ifndef WINGCHUN_BROKER_CLIENT_H
#define WINGCHUN_BROKER_CLIENT_H

#include <kungfu/longfist/longfist.h>
#include <kungfu/wingchun/broker/broker.h>
#include <kungfu/yijinjing/io.h>
#include <kungfu/yijinjing/log.h>
#include <kungfu/yijinjing/practice/apprentice.h>

namespace kungfu::wingchun::broker {
struct ResumePolicy {
  [[nodiscard]] virtual int64_t get_resmue_time(const yijinjing::practice::apprentice &app) const = 0;
};

struct ContinuousResumePolicy : public ResumePolicy {
  [[nodiscard]] int64_t get_resmue_time(const yijinjing::practice::apprentice &app) const override;
};

struct IntradayResumePolicy : public ResumePolicy {
  [[nodiscard]] int64_t get_resmue_time(const yijinjing::practice::apprentice &app) const override;
};

class Client {
public:
  explicit Client(yijinjing::practice::apprentice &app);

  virtual ~Client() = default;

  [[nodiscard]] const std::unordered_map<uint32_t, longfist::types::Instrument> &get_instruments() const;

  [[nodiscard]] virtual bool is_ready(uint32_t broker_location_uid) const;

  [[nodiscard]] virtual const ResumePolicy &get_resume_policy() const = 0;

  [[nodiscard]] virtual bool is_subscribed(uint32_t md_location_uid, const std::string &exchange_id,
                                           const std::string &instrument_id) const;

  virtual void subscribe(const yijinjing::data::location_ptr &md_location, const std::string &exchange_id,
                         const std::string &instrument_id);

  virtual void on_start(const rx::connectable_observable<event_ptr> &events);

protected:
  yijinjing::practice::apprentice &app_;

  [[nodiscard]] virtual bool should_connect_md(const yijinjing::data::location_ptr &md_location) const = 0;

  [[nodiscard]] virtual bool should_connect_td(const yijinjing::data::location_ptr &md_location) const = 0;

  virtual void subscribe_instruments(int64_t trigger_time, const yijinjing::data::location_ptr &md_location);

private:
  std::unordered_map<uint32_t, longfist::enums::BrokerState> broker_states_;

  std::unordered_map<uint32_t, yijinjing::data::location_ptr> ready_md_locations_;
  std::unordered_map<uint32_t, yijinjing::data::location_ptr> ready_td_locations_;

  std::unordered_map<uint32_t, yijinjing::data::location_ptr> instrument_md_locations_;
  std::unordered_map<uint32_t, longfist::types::Instrument> instruments_;

  void connect(const longfist::types::Register &register_data);
};

class AutoClient : public Client {
public:
  explicit AutoClient(yijinjing::practice::apprentice &app);

  [[nodiscard]] const ResumePolicy &get_resume_policy() const override;

protected:
  [[nodiscard]] bool should_connect_md(const yijinjing::data::location_ptr &md_location) const override;

  [[nodiscard]] bool should_connect_td(const yijinjing::data::location_ptr &md_location) const override;

private:
  ContinuousResumePolicy resume_policy_ = {};
};

class ManualClient : public Client {
public:
  explicit ManualClient(yijinjing::practice::apprentice &app);

  [[nodiscard]] const ResumePolicy &get_resume_policy() const override;

  [[nodiscard]] bool is_subscribed(uint32_t md_location_uid, const std::string &exchange_id,
                                   const std::string &instrument_id) const override;

  void subscribe(const yijinjing::data::location_ptr &md_location, const std::string &exchange_id,
                 const std::string &instrument_id) override;

  [[nodiscard]] bool is_all_subscribed(uint32_t md_location_uid) const;

  void subscribe_all(const yijinjing::data::location_ptr &md_location);

  void enroll_account(const yijinjing::data::location_ptr &td_location);

protected:
  [[nodiscard]] bool should_connect_md(const yijinjing::data::location_ptr &md_location) const override;

  [[nodiscard]] bool should_connect_td(const yijinjing::data::location_ptr &md_location) const override;

  void subscribe_instruments(int64_t trigger_time, const yijinjing::data::location_ptr &md_location) override;

private:
  IntradayResumePolicy resume_policy_ = {};
  std::unordered_map<uint32_t, bool> enrolled_md_locations_ = {};
  std::unordered_map<uint32_t, bool> enrolled_td_locations_ = {};
};
} // namespace kungfu::wingchun::broker

#endif // WINGCHUN_BROKER_CLIENT_H
